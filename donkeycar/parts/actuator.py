"""
actuators.py
Classes to control the motors and servos. These classes
are wrapped in a mixer class before being used in the drive loop.
"""

import time
import math
import donkeycar as dk
#import piconzero as pz #comment this line when trainning

SERVO_OUTPUT = 2
STOP = 90
#init servo/digital outputs
#ch0
servoPort0 = 0
#ch1
servoPort1 = 1
#ch2
servoPort2 = 2

#sudo i2cdetect -y 1 #To View i2c addresses
 #initialize and clear settings
#pz.init( ) #comment this line when trainning

class PCA9685:
    """
    PWM motor controler using PCA9685 boards.
    This is used for most RC Cars
    """
    def __init__(self, channel, frequency=60):
        import Adafruit_PCA9685
        # Initialise the PCA9685 using the default address (0x40).
        self.pwm = Adafruit_PCA9685.PCA9685()
        self.pwm.set_pwm_freq(frequency)
        self.channel = channel

    def set_pulse(self, pulse):
        try:
            self.pwm.set_pwm(self.channel, 0, pulse)
        except OSError as err:
            print("Unexpected issue setting PWM (check wires to motor board): {0}".format(err))

    def run(self, pulse):
        self.set_pulse(pulse)


class PICONZERO:
    """
    PWM motor controler using PCA9685 boards.
    This is used for most RC Cars
    """
    def __init__(self, channel, frequency=60):
        ##import Adafruit_PCA9685        

        # Set output modeS
        pz.setOutputConfig(channel, SERVO_OUTPUT) #set to output Servo (0 - 180)
        #pz.setOutputConfig(servoPort1, SERVO_OUTPUT) #set to output Servo (0 - 180)

        # Initialise the PCA9685 using the default address (0x40).
        self.pwm = None #Adafruit_PCA9685.PCA9685()
        #self.pwm.set_pwm_freq(frequency)
        self.channel = channel

    def set_pulse(self, pulse):
        #pass
        pz.setOutput(self.channel, int(pulse))
##        try:
##            self.pwm.set_pwm(self.channel, 0, pulse)
##        except OSError as err:
##            print("Unexpected issue setting PWM (check wires to motor board): {0}".format(err))

    def run(self, pulse):
        self.set_pulse(pulse)        

class PWMSteering:
    """
    Wrapper over a PWM motor cotnroller to convert angles to PWM pulses.
    """
    LEFT_ANGLE = -1
    RIGHT_ANGLE = 1

    def __init__(self, controller=None,
                 left_pulse=290, right_pulse=490):

        self.controller = controller
        self.left_pulse = left_pulse
        self.right_pulse = right_pulse

    def run(self, angle):
        # map absolute angle to angle that vehicle can implement.
        pulse = dk.util.data.map_range(
            angle,
            self.LEFT_ANGLE, self.RIGHT_ANGLE,
            self.left_pulse, self.right_pulse
        )

        self.controller.set_pulse(pulse)

    def shutdown(self):
        self.run(0)  # set steering straight


class PWMThrottle:
    """
    Wrapper over a PWM motor cotnroller to convert -1 to 1 throttle
    values to PWM pulses.
    """
    MIN_THROTTLE = -1
    MAX_THROTTLE = 1

    def __init__(self,
                 controller=None,
                 max_pulse=300,
                 min_pulse=490,
                 zero_pulse=350):

        self.controller = controller
        self.max_pulse = max_pulse
        self.min_pulse = min_pulse
        self.zero_pulse = zero_pulse

        # send zero pulse to calibrate ESC
        ##self.controller.set_pulse(self.zero_pulse)
        time.sleep(1)

    def run(self, throttle):
        if throttle > 0:
            pulse = dk.util.data.map_range(throttle,
                                           0, self.MAX_THROTTLE,
                                           self.zero_pulse, self.max_pulse)
        else:
            pulse = dk.util.data.map_range(throttle,
                                           self.MIN_THROTTLE, 0,
                                           self.min_pulse, self.zero_pulse)

        self.controller.set_pulse(pulse)

    def shutdown(self):
        self.run(0)  # stop vehicle


class Adafruit_DCMotor_Hat:
    """
    Adafruit DC Motor Controller
    Used for each motor on a differential drive car.
    """
    def __init__(self, motor_num):
        #from Adafruit_MotorHAT import Adafruit_MotorHAT
        #import atexit

        self.FORWARD = None #Adafruit_MotorHAT.FORWARD
        self.BACKWARD = None #Adafruit_MotorHAT.BACKWARD
        self.mh = None #Adafruit_MotorHAT(addr=0x60)

        self.motor = self.mh.getMotor(motor_num)
        self.motor_num = motor_num

        atexit.register(self.turn_off_motors)
        self.speed = 0
        self.throttle = 0

    def run(self, speed):
        """
        Update the speed of the motor where 1 is full forward and
        -1 is full backwards.
        """
        if speed > 1 or speed < -1:
            raise ValueError("Speed must be between 1(forward) and -1(reverse)")

        self.speed = speed
        self.throttle = int(dk.util.data.map_range(abs(speed), -1, 1, -255, 255))

        if speed > 0:
            self.motor.run(self.FORWARD)
        else:
            self.motor.run(self.BACKWARD)

        self.motor.setSpeed(self.throttle)

    def shutdown(self):
        self.mh.getMotor(self.motor_num).run(Adafruit_MotorHAT.RELEASE)

class DifferentialDriveMixer:
    """
    Mixer for vehicles driving differential drive vehicle.
    Currently designed for cars with 2 wheels.
    Ref: https://github.com/autorope/donkeycar/blob/c05e774d0838776705f0fa35fcd90301e8b9f2b2/donkey/mixers.py

    https://electronics.stackexchange.com/questions/19669/algorithm-for-mixing-2-axis-analog-input-to-control-a-differential-motor-drive
    """
    def __init__(self, left_motor, right_motor):        

        self.left_motor = left_motor
        self.right_motor = right_motor       

        self.leftspeed = STOP
        self.rightspeed = STOP
        
        self.angle=0
        self.throttle=0
    

    def run(self, throttle, angle):
        self.throttle = throttle
        self.angle = angle
        
        if throttle == 0 and angle == 0:            
           self.stop()           
        else:

            # rotate by 45 degrees
            self.angle += math.pi / 4

            # back to cartesian
            l_speed = self.throttle * math.cos(self.angle)
            r_speed = self.throttle * math.sin(self.angle)

            # rescale the new coords
            l_speed = l_speed * math.sqrt(2)
            r_speed = r_speed * math.sqrt(2)

            #Clip between -1 & 1            
            l_speed = min(max(l_speed, -1), 1)
            r_speed = min(max(r_speed, -1), 1)
            
            lpwm = 90 - (l_speed * 90)
            rpwm = 90 + (r_speed * 90)

            self.left_motor.set_pulse(lpwm)
            self.right_motor.set_pulse(rpwm)            

            #self.leftspeed = l_speed
            #self.rightspeed = r_speed
                       
    def test(self, seconds=1):
        telemetry = [(0, -.5), (0, -.5), (0, 0), (0, .5), (0, .5),  (0, 0), ]
        for t in telemetry:
            
            
            self.update(*t)
            print('throttle: %s   angle: %s' % (self.throttle, self.angle))
            print('l_speed: %s  r_speed: %s' % (self.left_motor.speed, 
                                                self.right_motor.speed))
            time.sleep(seconds)
            
        print('test complete')
        
        
    def stop(self):
        self.left_motor.set_pulse(STOP)
        self.right_motor.set_pulse(STOP)        
