---
title: Learning in 2 KB
---
{%- assign series = site.data.projects | where: "url", "/learning-in-2kb/" | first -%}

{{ series.summary }}

<ul class="specs">
  {%- for spec in series.specs %}
  <li>{{ spec }}</li>
  {%- endfor %}
</ul>

## Roadmap

{% include roadmap.html parts=series.parts %}

Each part gets its own write-up here as it's built.
