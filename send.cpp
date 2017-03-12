/*
 Usage: ./send <systemCode> <unitCode> <command>
 Command is 0 for OFF and 1 for ON
 */

#include "rc-switch/RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>
#include "cstdlib"

int main(int argc, char *argv[]) {
    
    /*
     Set output pin via RC_SWITCH_OUTPUT_PIN.
     see https://projects.drogon.net/raspberry-pi/wiringpi/pins/
     for pin mapping of the raspberry pi GPIO connector
     */
    char* outputPin = std::getenv("RC_SWITCH_OUTPUT_PIN");
    int PIN = atoi(outputPin);
    int systemCode = atoi(argv[1]);
    int unitCode = atoi(argv[2]);
    int command  = atoi(argv[3]);
    
    if (wiringPiSetup () == -1) return 1;
	printf("sending systemCode[%i] unitCode[%i] command[%i] to PIN[%i]\n", systemCode, unitCode, command, PIN);
	RCSwitch mySwitch = RCSwitch();
	mySwitch.enableTransmit(PIN);
    switch(command) {
        case 1:
            mySwitch.switchOn(systemCode, unitCode);
            break;
        case 0:
            mySwitch.switchOff(systemCode, unitCode);
            break;
        default:
            printf("command[%i] is unsupported\n", command);
            return -1;
    }
	return 0;
}
