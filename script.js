const tempChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  mark: {
    type: "area",
    tooltip: true
  },
  width: "container",
  data: {
    url: "data/temperatures.csv",
  },
  encoding: {
    x: {
      field: "year",
      timeUnit: "year",
      type: "temporal",
      title: "Year",
      axis: { grid: false }
    },
    y: {
      field: "no_smoothing",
      type: "quantitative",
      title: "Relative Temperature",
      axis: { grid: false }
    },
    color: { field: "higher_than_zero", type: "nominal", legend: null},
    "tooltip": [
      { field: "year",
      timeUnit: "year",
      type: "temporal",
      title: "Year",},
      {field: "no_smoothing",
      type: "quantitative",
      title: "Relative Temperature", }
    ]
  }
}
vegaEmbed("#temp", tempChart)


const salesChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "EV vehicle sales",
  mark: {
    type: "bar",
    tooltip: true
  },
  "params": [
    {
      "name": "highlight",
      "select": {"type": "point", "on": "mouseover"}
    },
    {"name": "select", "select": "point"}
  ],
  width: "container",
  data: {
    url: "data/iea.csv",
  },
  transform: [
    {
      filter: "datum.parameter=='EV sales' && datum.category=='Historical' && datum.region!='World'"
    },
    {
      calculate: "datum.value/1000000", "as": "value"
    }
  ],
  encoding: {
    x: {
      field: "year",
      timeUnit: "year",
      type: "temporal",
      title: "Year",
      axis: { grid: false }
    },
    y: {
      field: "value",
      type: "quantitative",
      title: "Sales (In millions)",
      axis: { grid: false },
      stack: "zero",
      aggregate: "sum"
    },
    "fillOpacity": {
      "condition": {"param": "select", "value": 1},
      "value": 0.3
    },
    "strokeWidth": {
      "condition": [
        {
          "param": "select",
          "empty": false,
          "value": 2
        },
        {
          "param": "highlight",
          "empty": false,
          "value": 1
        }
      ],
      "value": 0
    },
    color: { field: "powertrain", type: "nominal", title: "Powertrain" },
  }
}
vegaEmbed("#sales", salesChart)


const salesPerctChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Electric Vehicle marketshare growth",
  mark: {
    type: "area",
  },
  width: "container",
  data: {
    url: "data/iea.csv",
  },
  transform: [
    {
      filter: "datum.parameter=='EV sales share' && datum.category=='Historical' && datum.region=='World'"
    },
    {
      calculate: "100 - datum.value",
      as: "traditional_sales"
    }
  ],
  encoding: {
    x: {
      field: "year",
      type: "temporal",
      axis: { grid: false }
    },
    y: {
      field: "value",
      type: "quantitative",
      axis: { grid: true },
      aggregate: "sum"
    },
    tooltip: [
      {"field": "year", "type": "temporal", "title": "Year", "timeUnit": "year",},
      {"field": "value", "type": "quantitative", "title": "Sales (%)", "format": ".3f"} 
    ]
  }
}
vegaEmbed("#sales-perct", salesPerctChart)


const typesChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  title: "Types of EVs",
  mark: {
    type: "arc",
    tooltip: true
  },
  width: "container",
  data: {
    url: "data/iea.csv",
  },
  "params": [{
    "name": "modesl",
    "select": {"type": "point", "fields": ["mode"]},
    "bind": "legend"
  }],
  transform: [
    {
      filter: "datum.parameter=='EV sales' && datum.category=='Historical' && datum.region!='World' && datum.year=='2021'"
    }
  ],
  encoding: {
    theta: {
      field: "value",
      type: "quantitative",
      title: "Sales",
      axis: { grid: false },
      stack: "zero",
      aggregate: "sum"
    },
    color: {
      field: "mode",
      type: "nominal",
      title: "Type",
    },
    "opacity": {
      "condition": {"param": "modesl", "value": 1},
      "value": 0.2
    }
  }
}
vegaEmbed("#types", typesChart)


const countriesChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "EV sales per country",
  "width": 800,
  "height": 400,
  "projection": { "type": "equalEarth" },
  "data": {
    "url": "https://raw.githubusercontent.com/JiazhouLiu/FIT3179/main/VegaLite/3_choropleth_map/js/ne_110m_admin_0_countries.topojson",
    "format": { "type": "topojson", "feature": "ne_110m_admin_0_countries" }
  },
  "transform": [
    {
      "lookup": "properties.ISO_A2", 
      "from": {
        "data": {
          "url": "data/iea-geo.json"
        },
        "key": "region",
        "fields": ["value", "value_str"]
      }
    }
  ],
  "mark": { "type": "geoshape" },
  "encoding": {
    "color": {
      "field": "value",
      "type": "quantitative"
    },
    "tooltip": [
      { "field": "properties.NAME", "type": "nominal", "title": "Country" },
      { "field": "value_str", "title": "Sales", "type": "nominal" }
    ]
  }
}
vegaEmbed("#countries", countriesChart)



//Hero bg js.
window.addEventListener("scroll", e => {
  //Get scroll pos.
  var at = document.scrollingElement.scrollTop
  var pageHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  //Get relative post.
  if (!at) var relative = 0
  //else if(at > pageHeight) var relative = 1
  else var relative = at / pageHeight

  var zoom = 1 + (relative * 50)
  if (zoom > 50) zoom = 50

  //Go inside earth.
  var earth = document.querySelector(".earth")
  earth.style.transform = "scale(" + zoom + ")"

  var bgPos = relative * 800, bgPosY = 300 //, bgPosY = 300 + (relative * 800)
  earth.style.backgroundPosition = bgPos + "px " + bgPosY + "px"

  //Bring in bg at 1x page.
  if (relative > 2.65) {
    if (relative > 4.15) {
      earth.style.visibility = "hidden"
      document.body.classList.add("black")
    }
    else{
      document.body.classList.remove("black")
    }
  }
  else if (relative > 0.9) {
    earth.style.visibility = "hidden"
    document.body.classList.add("black")
  }
  else earth.style.visibility = "visible", document.body.classList.remove("black")
}, false)