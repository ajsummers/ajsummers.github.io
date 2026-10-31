---
title: Blink, sense, log
layout: writeup
part: temperature
---
{% comment %}Formatting guide: _writing-guide.md in the repo root.{% endcomment %}

{: .placeholder}
How the registers from the previous section come together in working programs: blinking an LED, reading the temperature sensor, and sending readings to a laptop.

## Digital output

{: .placeholder-todo}
Driving a pin directly, for example the onboard LED.

```c
#define PORTB *((volatile unsigned char*) 0x25)
#define DDRB *((volatile unsigned char*) 0x24)

void delay(volatile long time){
	while (time != 0) {
		time--;
	}
}

int main() {
	DDRB |= (1 << 5);
	
	while (1) {
		PORTB |= (1 << 5);
		delay(1000000);
		
		PORTB &= ~(1 << 5);
		delay(1000000);
	}	
}
```

## Analog input

{: .placeholder-plain}
Configuring the ADC and reading the temperature sensor.

```c
// Placeholder: ADC setup and read code
```

{: .note}
**Note**
Placeholder: a side note, such as a datasheet detail that's easy to miss.

## Serial output

{: .placeholder-todo}
Setting up the UART to stream readings to a laptop for logging.

```c
// Placeholder: UART code
```
