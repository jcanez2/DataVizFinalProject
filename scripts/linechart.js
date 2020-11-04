let thisPath;
let covidPath;
let covidArea;
let thisArea;
let covidPoints;
let thisPoints;
let lineSvg;
let mortalityData;
let x = 'xyz';
let lineInnerWidth = 1300;
let lineInnerHeight = 550;
let dataAvg = [];
let data2020 = [];
let data2019 = [];
let data2018 = [];
let data2017 = [];
let data2016 = [];
let data2015 = [];
let yearsArr = ['Year2020', 'Year2019', 'Year2018', 'Year2017', 'Year2016', 'Year2015' ,'Average'];
let lineColors = ['#F52EEF', 'blue', 'green', 'yellow', 'black', 'orange', '#F52EEF']
// Runs When the page is loaded:
document.addEventListener("DOMContentLoaded", function(){
    lineSvg = d3.select('#linechart');

    Promise.all([
        d3.csv('data/usMortalityRaw.csv')
    ]).then(function(rawData){
        mortalityData = rawData[0];
        
        createDataModel();
        drawLineGraph();
        drawRequestedLines();

        toggleOpacity();
    })
});

function createDataModel(){
    let dataLine = mortalityData;
    dataLine.forEach(d => {
        dataAvg.push(d.Average);
        data2020.push(d.Year2020);
        data2019.push(d.Year2019);
        data2018.push(d.Year2018);
        data2017.push(d.Year2017);
        data2016.push(d.Year2016);
        data2015.push(d.Year2015);
    })
}

function drawRequestedLines(){
    let i = 0;
    for(let el of yearsArr){
        if((d3.select('#covidID').checked == false)){continue;}
        drawLine(el, lineColors[i]);
        i++;
    }
}

function drawLineGraph(){
    let graph = lineSvg;
    
    let x = d3.scaleLinear()
        .domain([1, 36])//d3.extent(graph, function(d) { return d.Week; }))
        .range([ 0, lineInnerWidth ]);

    let y = d3.scaleLinear()
        .domain([50000, 80000])
        .range([lineInnerHeight,0]);
    
    let g = graph.append("g")
    .attr("transform",`translate(${140},${60})`);

    g.append("g")
    .style("font-size", "18px")
    .attr("font-family", "sans-serif")
    .attr("color", "white")
    .call(d3.axisLeft(y)
    .tickSize(-lineInnerWidth))
    .call(g => g.select(".domain")
            .remove())
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 1)
            .attr("stroke-dasharray", "5,10"));

    g.append("text")
        .style("fill", "white")
        .style("text-anchor","middle")
        .attr("transform",`translate(${lineInnerWidth/2},${lineInnerHeight  + 50})`)
        .style("font-size", "24px")
        .attr("font-family", "sans-serif")
        .text("Week");

    // format and attach bottom axis
    g.append("g")
        .attr("class","xAxis")   
        .attr("font-family", "sans-serif")
        .attr("color", "white")
        .style("font-size", "16px")
        .attr("transform",`translate(0,${lineInnerHeight})`)
        .call(d3.axisBottom(x)
        .ticks(d3.Number)
        .tickFormat(d3.format("0")));
}

function drawLine(thisYear = 'Year2015', thisColor = 'black'){
    let graph = lineSvg;

    let x = d3.scaleLinear()
        .domain([1, 36])
        .range([ 0, lineInnerWidth ]);

    let y = d3.scaleLinear()
        .domain([45000, 80000])
        .range([lineInnerHeight,0]);
    
    let g = graph.append("g")
        .attr("transform",`translate(${150},${60})`);

    const line = d3.line()
        .x(d => x(d.Week))
        .y(d => y(d[thisYear] || 0))  
        .curve(d3.curveLinear);

    

    if(thisYear == 'Year2020'){
        covidPath = g.append("path")
            .datum(mortalityData)  
            .style("stroke-width",'4')
            .style("r", 0)      
            .style("fill",'none')
            .style("stroke",thisColor)
            .attr("d", line);
        
        covidArea = g.append("path")
            .datum(mortalityData)
            .attr("fill", thisColor)
            .attr("fill-opacity", .4)
            .attr("stroke", "none")
            .attr("d", d3.area()
            .x(d => x(d.Week))
            .y0(lineInnerHeight)
            .y1(d => y(d[thisYear] || 0)) );
        covidPonts = g.selectAll("circles")
            .data(mortalityData)
            .enter()
            .append("circle")
                .attr("fill", "white")
                .attr("stroke", "none")
                // .attr("transform", "translate(100," + (margins.top) + ")")
                .attr("cx", d => x(d.Week))
                .attr("cy", d => y(d[thisYear] || 0))
                .attr("r", 3); 
    }else{
        thisPath = g.append("path")
            .datum(mortalityData)  
            .style("stroke-width",'4')
            .style("r", 0)      
            .style("fill",'none')
            .style("stroke",thisColor)
            .attr("d", line); 
        thisArea = g.append("path")
            .datum(mortalityData)
            .attr("fill", thisColor)
            .attr("fill-opacity", .4)
            .attr("stroke", "none")
            .attr("d", d3.area()
            .x(d => x(d.Week))
            .y0(lineInnerHeight)
            .y1(d => y(d[thisYear] || 0)) );
        thisPonts = g.selectAll("circles")
            .data(mortalityData)
            .enter()
            .append("circle")
                .attr("fill", "white")
                .attr("stroke", "none")
                // .attr("transform", "translate(100," + (margins.top) + ")")
                .attr("cx", d => x(d.Week))
                .attr("cy", d => y(d[thisYear] || 0))
                .attr("r", 3); 
    }
}

function toggleOpacity(){
    console.log('test1');
// TODO: hide and display dots
    if(document.getElementById('covidID').checked){
        console.log('box is unChecked');
        thisPath.style("stroke-width",'4').attr('opacity', 0);
        thisArea.style("stroke-width",'4').attr('opacity', 0);
        // thisPoints.attr("r", 0);
        covidPath.style("stroke-width",'4').attr('opacity', 1);
        covidArea.style("stroke-width",'4').attr('opacity', 1);
        // covidPoints.attr("r", 3);
    }else{
        console.log('Box is Checked')
        thisPath.style("stroke-width",'9').attr('opacity', 1);
        thisArea.style("stroke-width",'4').attr('opacity', 1); 
        // thisPoints.attr("r", 3);
        covidPath.style("stroke-width",'4').attr('opacity', 0);
        covidArea.style("stroke-width",'4').attr('opacity', 0);
        // covidPoints.attr("r", 0);
    }  
}

