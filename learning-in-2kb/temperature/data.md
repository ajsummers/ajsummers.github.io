---
title: Collecting training data
layout: writeup
part: temperature
math: true
---
{% comment %}Formatting guide: _writing-guide.md in the repo root.{% endcomment %}

{: .placeholder-bar}
How readings were logged, the conditions covered, and what the dataset looks like.

Controller output it
$$
u(t) = K_p\, e(t) + K_i \int_0^t e(\tau)\, d\tau + K_d \frac{de(t)}{dt}
\label{eq:pid}
$$

```python
# Placeholder: data logging script
```

<iframe src="/assets/adc_readings4.html" style="width:100%; aspect-ratio:2/1; border:none;"></iframe>
