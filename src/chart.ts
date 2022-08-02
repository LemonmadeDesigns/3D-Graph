/*
 * LightningChartJS BoxSeries3D
 */

// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    AxisScrollStrategies,
    PalettedFill,
    ColorRGBA,
    LUT,
    UILayoutBuilders,
    UIOrigins,
    UIElementBuilders,
    Themes
} = lcjs

const {
    createWaterDropDataGenerator
} = require('@arction/xydata')


// Creating the chart object:
const chart3D = lightningChart().Chart3D({
    
    // Disable all animations for the chart.
    // After calling this function, animations 
    // (Zooming, scaling) for all Axes will be disabled. 
    disableAnimations: true,

    // The LightningChart library offers a collection 
    // of default implementations that can be accessed by Themes.
    theme: Themes.lightNew,
} )
    .setTitle( 'Lemons 3D_Box' )


// getDefaultAxisY: Gets the Y axis.
// setScrollStrategy: Specify ScrollStrategy 
// of the Axis.This decides where the Axis 
// scrolls based on current view and series boundaries.
chart3D.getDefaultAxisY()
    .setScrollStrategy( AxisScrollStrategies.expansion )
    .setTitle( 'Age' )


// getDefaultAxisX: Gets the X axis
chart3D.getDefaultAxisX()
    .setTitle( 'Male' )


// getDefaultAxisz: Gets the z axis
chart3D.getDefaultAxisZ()
    .setTitle( 'Female' )


// const boxSeries: .addBoxSeries = Creates Series for visualization of large sets of individually configurable 3D Boxes.
const boxSeries = chart3D.addBoxSeries()


// const resolution: Constant that will affect the number of columns displayed in the 3D chart.
// Resolution = 50
const resolution = 10

// Create Color Look-Up-Table and FillStyle
const lut = new LUT( {
    steps: [
        { value: 0, color: ColorRGBA( 0, 0, 0 ) },
        { value: 30, color: ColorRGBA( 255, 255, 0 ) },
        { value: 45, color: ColorRGBA( 255, 204, 0 ) },
        { value: 60, color: ColorRGBA( 255, 128, 0 ) },
        { value: 100, color: ColorRGBA( 255, 0, 0 ) }
    ],
    interpolate: true
} )


// boxSeries: Specify edge roundness. For applications 
// with massive amounts of small Boxes, it is wise to 
// disable for performance benefits.
boxSeries
    .setFillStyle( new PalettedFill( { lut, lookUpProperty: 'y' } ) )
    // Specify edge roundness.
    // For applications with massive amounts of small Boxes, it is wise to disable for performance benefits.
    .setRoundedEdges( 0.4 )

// Add LegendBox to chart.
const legend = chart3D.addLegendBox()
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-width',
        maxWidth: 0.30,
    })
    .add(chart3D)


// Generate height map data.
createWaterDropDataGenerator()
    
    // setRows: Creates and add the number 
    // of rows specified in the constant[resolution].
    .setRows(resolution)
    
    // setColumns: Creates and add the number of 
    // columns specified in the constant[resolution].
    .setColumns( resolution )
    .generate()
    .then( waterdropData => {
        let t = 0

        // const step: This constant will create “water drops” 
        // equal to the number of resolution specified before.
        const step = () => {
            const result = []
            for ( let x = 0; x < resolution; x++ ) {
                for ( let y = 0; y < resolution; y++ ) {
                    const s = 1
                    const height = Math.max(
                        waterdropData[y][x] +
                        50 * Math.sin( ( t + x * .50 ) * Math.PI / resolution ) +
                        20 * Math.sin( ( t + y * 1.0 ) * Math.PI / resolution ), 0 )
                    const box = {
                        xCenter: x,
                        yCenter: height / 2,
                        zCenter: y,
                        xSize: s,
                        ySize: height,
                        zSize: s,
                        // Specify an ID for each Box in order to 
                        // modify it during later frames, instead 
                        // of making new Boxes.
                        id: String( result.length ),
                    }
                    result.push( box )
                }
            }
        
            // requestAnimationframe: Indicates to the browser 
            // thats a new animation needs to be created before 
            // the next repaint.
            boxSeries
                .invalidateData( result )
        
            t += 0.1
            requestAnimationFrame( step )
        }
        step()
    })
