---
title: "Part 1: Temperature"
layout: writeup
---

{% comment %}
How to style a paragraph: put one of these lines directly above it, with no
blank line in between.

  Placeholders (draft text, delete the line once the paragraph is written):
    {: .placeholder}        dashed box
    {: .placeholder-bar}    accent bar on the left
    {: .placeholder-tint}   tinted block
    {: .placeholder-todo}   "TODO" tag
    {: .placeholder-plain}  grey italics

  Finished writing:
    {: .lead}               larger opening paragraph, once at the top
    {: .note}               callout box; start it with a bold label such as
                            **Note**, **Tip** or **Warning** on its own line

  A paragraph with no {: ...} line is normal body text.

Code: wrap it in ```c or ```python fences for syntax colouring.
  To make a code block foldable, put one of these lines directly above the
  opening ``` fence:
    {: .fold-code}                    foldable, open when the page loads
    {: .fold-code .folded}            foldable, folded when the page loads
    {: .fold-code data-label="ADC setup"}   custom bar text (default is
                                      "C code" / "Python code"); works with
                                      .folded too
  A code block with no {: ...} line is a normal, always-visible block.

Headings: ## gets a divider line and appears in "On this page"; ### is a
subsection. All ## to #### headings can be folded by clicking them.
{% endcomment %}

<p class="series-back"><a href="/learning-in-2kb/"><span aria-hidden="true">← </span>Learning in 2 KB</a></p>

{: .lead}
Intro: what this part builds, and why temperature is a good first project.

<ul class="specs">
  <li>ATmega328P</li>
  <li>Temperature sensor</li>
  <li>Bare-metal C</li>
</ul>

**On this page**

* TOC
{:toc}

## Hardware

{: .placeholder}
Parts list, wiring diagram or photo, and which pins the sensor and any outputs connect to.

## Bare-metal I/O

{: .placeholder-bar}
<b>Why use bare metal programming instead of Arduino IDE or other frameworks?</b><br><br> Using bare metal, we can keep strict control over our memory budget and sampling timing. It also opens up access to peripheral features Arduino hides, like the internal temperature sensor. Bare metal skills also transfer more broadly to other classes of chips (e.g. STM32) and to production firmware. Finally, while I am currently using the ATmega328 chip, which is not significantly constrained in memory, I plan to later implement these findings on a much more constrained chip, like an ATtiny85. This chip has significantly less space, and we will need to cut as much overhead as reasonably possible to get ML models to share some of the space.

### Registers

{: .placeholder-plain}
Defining the types of registers we will use.

In this project, we will make use of a few classes of registers. These are provided in the table below. The reference page numbers are in reference to the [ATmega328p datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf).

#### Output registers

| Register(s) | Memory Address(es) | Purpose | Ref P# |
| :--: | :--: | :-- | :--: |
| DDR\[B,C,D\] | `0x24`, `0x27`, `0x2A` | Port _ Data Direction Register | [72-73](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=72) |
| PORT\[B,C,D\] | `0x25`, `0x28`, `0x2B` | Port _ Data Register | [72-73](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=72) |

Later in this project, we will be using the temperature sensor to drive an LED response. To do this, we will need to make use of output registers. The PORT_/DDR_ registers allow us to send digital output through specific pins of the ATmega328. PORTB and DDRB correspond to the PB pins. If we look at the ATmega328 pinout, we can see this corresponds to pins 9-10,14-19 (PB0-7):

[<img src="/learning-in-2kb/images/atmega328p-pinout.png" alt="ATmega328 pinout diagram" width="400"/>](https://components101.com/microcontrollers/atmega328p-pinout-features-datasheet)


In this project, we will be starting by using the PB5 pin (19). As we can see in the datasheet, this corresponds to the 5th bit in both DDRB and PORTB:

[![PORTB and DDRB register bit layouts from the ATmega328P datasheet](/learning-in-2kb/images/portb-ddrb-registers.png)](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=72)

In the following code, we define PORTB and DDRB, then set PB5 as an output pin, and finally, set the digital output for PB5 to HIGH, or on.
```c
#define PORTB *((volatile unsigned char*) 0x25)
#define DDRB *((volatile unsigned char*) 0x24)

// The following 3 lines all perform the same task
DDRB = (1 << 5)    // 1 bit shifted 5 times, resulting in 00100000
DDRB = 0b00100000  // Same value given directly as binary
DDRB = 0x20        // Value provided as hex

// For PORTB, we'll use the most readable of the three
PORTB = (1 << 5)
```

{: .placeholder-bar}
It's important that we understand what's happening in this code. Assignments like `PORTB = (1 << 5)` set the pin we're using (PB5) to HIGH, but also sets all other PB pins to LOW. To set only PB5 as an output and to HIGH, we can use bitwise operations:

```c
// setting PB5 as output
DDRB = DDBR | (1 << 5)
// or equivalently,
DDBR |= (1 << 5)

// setting PB5 output to HIGH
PORTB |= (1 << 5)
```

#### ADC registers

| Register(s) | Memory Address(es) | Purpose | Ref P# |
| :--: | :--: | :-- | :--: |
| ADCSRA | `0x7A` | ADC Control Register | [218](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=218) |
| ADMUX | `0x7C` | ADC Reference and Channel | [217](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=217) |
| ADCL | `0x78` | ADC Result, Low Byte | [219](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=219) |
| ADCH | `0x79` | ADC Results, High Byte | [219](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=219) |
| DIDR0 | `0x7E` | Digital Input Disable | [220](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=220) |

The ADC registers are more complicated than PORTB and DDRB. First we will look at ADCSRA. Below is a table showing the relevant bits in ADCSRA and how we will use them.

| Bit | Designation | Our setting | Purpose/Comments |
| :--: | :--: | :--: | :-- |
| 7 | ADEN | 1 | ADC Enable |
| 6 | ADSC | 0 -> 1 | ADC Start Conversion |
| 5 | ADATE | 0 | ADC Auto Trigger Enable |
| 4 | ADIF | 0 | ADC Interrupt Flag |
| 3 | ADIE | 0 | ADC Interrupt Enable |
| 2:0 | ADPS2:0 | 111 | ADC Prescaler Select Bits |

We only use a few bits in this register. ADEN enables ADC, which we obviously want to set to 1. ADSC is kept at 0 until we are ready to read the ADC input. Then we manually set it to 1, and the hardware will set it back to 0 once the ADC input is read. We don't use any auto triggers or interrupts here, so ADATE, ADIF, and ADIE are all set to 0. Finally, we have the prescaler to scale ADC clock based on the chip clock. We choose a scaler of 128, for an ADC clock of 125 kHz. This corresponds to a value of 111 for the ADPS2:0 bits.

The next register we touch is the ADMUX register:

| Bit | Designation | Our setting | Purpose/Comments |
| :--: | :--: | :--: | :-- |
| 7:6 | REFS | 01 | Sets reference for ADC, in this case 5 V |
| 5 | ADLAR | 0 | Result right-adjusted |
| 4 | unused | -- | -- |
| 3:0 | MUX | 0000 | input = ADC0 |

Setting REFS to 01 sets the ADC reference to 5 V. Setting MUX to 0000 sets the input to ADC0 (PC0). Finally, we use DIDR0 to disconnect A0's digital input buffer:

| Bit | Designation | Our setting | Purpose/Comments |
| :--: | :--: | :--: | :-- |
| 0 | ADC0D | 1 | Disconnects A0 digital input buffer |

In this case, we are manually setting all bits for these registers. So we directly set them rather than using bitwise operators:
```c
#define ADCSRA *((volatile unsigned char*) 0x7A)
#define ADMUX *((volatile unsigned char*) 0x7C)
#define DIDR0 *((volatile unsigned char*) 0x7E)

ADCSRA = (1 << 7) | 111  // 0b10000111, 0x87
ADMUX = (1 << 6)         // 0b01000000, 0x40
DIDR0 = 1                // 0b00000001, 0x01
```

We are also using two of the registers as input. The actual ADC input comes in ADCH (high byte) and ADCL (low byte). The ADCH and ADCL combine for a total of 10 bits. This corresponds to an integer max value of 1023 (2^10 - 1). See the image below.

Placeholder

We can first see that all of these bits are read-only. This makes sense, as these are input values captured from the analog pin. We can also see how ADLAR in ADMUX affects the configuration of ADCH and ADCL. With ADLAR set to 0, ADCL contains 8 of the input bits. With ADLAR set to 1, ADCH contains 8 of the input bits. We set ADLAR to 0, so the top configuration is what we're working with. Note that to get a new ADC reading, you must first set bit 6 of ADCSRA (ADSC) to 1. This starts the conversion. The ADSC bit is then flipped to 0 when the ADC input is ready. So to grab the ADC input, we would use the following code:
```c
#define ADCSRA *((volatile unsigned char*) 0x7A)
#define ADCH *((volatile unsigned char*) 0x79)
#define ADCL *((volatile unsigned char*) 0x78)

ADCSRA |= (1 << 6)          // Set the ADSC bit to 1
while (ADCSRA & (1 << 6));  // wait for hardware to clear ADSC bit

uint8_t hi = ADCH;          // Get high byte
uint8_t lo = ADCL;          // Get low byte

uint16_t adc_in = (hi << 8) | lo;  // Combine high and low byte into integer
```

#### USART0 registers

| Register(s) | Memory Address(es) | Purpose | Ref P# |
| :--: | :--: | :-- | :--: |
| UCSR0A | `0xC0` | USART Control and Status Register n A | [159](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=159) |
| UCSR0B | `0xC1` | USART Control and Status Register n B | [160](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=160) |
| UCSR0C | `0xC2` | USART Control and Status Register n C | [161](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=161) |
| UBRR0L | `0xC4` | Baud divisor, low byte | [162](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=162) |
| UBRR0H | `0xC5` | Baud divisor, high byte | [162](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=162) |
| UDR0 | `0xC6` | Data | [159](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf#page=159) |


In this 
{% comment %}
{: .placeholder-tint}
How the DDRx, PORTx and PINx registers control a pin's direction, output and input.
{% endcomment %}

### Digital output

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

### Analog input

{: .placeholder-plain}
Configuring the ADC and reading the temperature sensor.

```c
// Placeholder: ADC setup and read code
```

{: .note}
**Note**
Placeholder: a side note, such as a datasheet detail that's easy to miss.

### Serial output

{: .placeholder-todo}
Setting up the UART to stream readings to a laptop for logging.

```c
// Placeholder: UART code
```

## Collecting training data

{: .placeholder-bar}
How readings were logged, the conditions covered, and what the dataset looks like.

```python
# Placeholder: data logging script
```

## Training the model

{: .placeholder}
The model choice (neural network or another statistical learning model), why it fits a 2 KB budget, and how it was trained and validated.

```python
# Placeholder: training code
```

{: .note}
**Tip**
Placeholder: a practical tip, such as a setting that made training easier.

## Running the model on the chip

### Exporting the model

{: .placeholder-tint}
Turning trained weights or coefficients into C arrays, and keeping them in flash with PROGMEM.

```c
// Placeholder: exported weights
```

### Inference

{: .placeholder-todo}
The inference code, and any fixed-point or float trade-offs.

```c
// Placeholder: inference code
```

### Memory budget

{: .placeholder-plain}
Flash and SRAM used by the program, the model and the buffers.

## Results

{: .placeholder}
How the on-chip predictions compare with the reference, with plots or tables.

## What's next

{: .placeholder-bar}
What this part taught, and how it leads into Part 2.
