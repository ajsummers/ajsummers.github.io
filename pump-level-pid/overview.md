---
title: Pump Level PID — Overview
---

{% include pump-nav.html %}

# Project Motivation & Overview

## Motivation

Shortly after completing my B.S. in Chemical Engineering, I found out about the unique intersection between chemical engineering and machine learning. In particular, I became interested in the specific application of machine learning towards industrial manufacturing, termed Smart Manufacturing. Smart manufacturing is a component of the larger smart industrial revolution (Industry 4.0) that has taken hold in many various processes. Having previously been intrigued by machine learning and statistical learning as a whole, this intersection of manufacturing/engineering and machine learning instantly fascinated me.

During my PhD work, I gained an invaluable wealth of knowledge about machine learning, systems engineering, and how to apply data science concepts towards engineering processes. My research allowed me to collaborate with material science labs and build efficient iterative design of experiments (DoE) strategies for use in engineering processes. This broadened my knowledge and allowed me to build a theoretical framework on how to use machine learning to help tune and optimize complex engineering processes. However, in all this work, there was a large piece that was missing.

When I started my PhD studies, I had hoped to learn at least a basic foundation of the actual hardware commonly used for smart manufacturing solutions - microcontrollers, soft sensors, PID tuning (still golden even in this new age). Previous students in my group worked at least partially with these kinds of systems. I had hoped that my materials science projects would lead in that direction. However, as is often the case in PhD studies, the projects took an unexpected path. Instead, I did (again) gain invaluable knowledge specifically of active learning (iterative DoE) strategies, but I did not have the good fortune of running into a problem that required microcontrollers or soft sensors.

So, long story short, I decided to take matters into my own hands, and teach myself these "foundational" skills I desparately wanted. The challenge was to find a suitable project to pull all of these concepts together. I needed a process that could be operated under a PID loop to stabilize the process at specific setpoints. Ideally, the process would be:
- At least be remotely related to chemical engineering concepts (transport phenomena / reactions),
- Simple/safe enough for one person to build and operate, and
- Complex enough that the solution would not be trivial.
There were many examples online of PID loops used to control an unstable self-balancing robot. But this was a mechanical process in nature. PID temperature control would be too high powered, and could be unsafe to run over long periods.

After some thought, I finally settled on a process that involved two tanks, a passive backflow line between the tanks, and an active line for pumping water specifically from Tank 2 into Tank 1. The controlled variable would be the differential height between the tanks. This would require level measurements on each tank in order to get the process variable. The passive line is added specifically to make the process dynamic. Without the passive line, the solution does not require a PID loop - just pump water from Tank 2 into Tank 1 until the setpoint is reached. The passive line instantly makes the process more complicated. Any time the differential height is above zero, water will be flowing through the passive line back to Tank 2. As the differential height increases, the backflow also increases. To me, this process seemed complex enough that a PID control loop or some other active control would be required to stabilize the differential height at a specific setpoint.