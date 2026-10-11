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
Headings: ## gets a divider line and appears in "On this page"; ### is a
subsection.
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
Why skip the Arduino libraries, and how the toolchain works (compiler, flashing the chip).

### Registers

{: .placeholder-tint}
How the DDRx, PORTx and PINx registers control a pin's direction, output and input.

### Digital output

{: .placeholder-todo}
Driving a pin directly, for example the onboard LED.

```c
// Placeholder: digital output code
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
