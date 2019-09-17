// Copyright 2019, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 1D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  class Explore1DGraphControlPanel extends GraphControlPanel {

    /**
     * @param {VectorSet} horizontalVectorSet
     * @param {VectorSet} verticalVectorSet
     * @param {EnumerationProperty.<GraphOrientations>} graphOrientationProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {Object} [options]
     */
    constructor( horizontalVectorSet, verticalVectorSet, graphOrientationProperty,
                 valuesVisibleProperty, gridVisibleProperty, options ) {

      assert && assert( horizontalVectorSet instanceof VectorSet, `invalid horizontalVectorSet: ${horizontalVectorSet}` );
      assert && assert( verticalVectorSet instanceof VectorSet, `invalid verticalVectorSet: ${verticalVectorSet}` );
      assert && assert( graphOrientationProperty instanceof EnumerationProperty,
        `invalid graphOrientationProperty: ${graphOrientationProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );

      const horizontalSumCheckbox = new SumCheckbox( horizontalVectorSet.sumVisibleProperty,
        horizontalVectorSet.vectorColorPalette );

      const verticalSumCheckbox = new SumCheckbox( verticalVectorSet.sumVisibleProperty,
        verticalVectorSet.vectorColorPalette );

      // Toggle visibility of the SumCheckboxes to match graph orientation.
      // Is never unlinked since the graph control panel is never disposed.
      graphOrientationProperty.link( gridOrientation => {
        horizontalSumCheckbox.visible = ( gridOrientation === GraphOrientations.HORIZONTAL );
        verticalSumCheckbox.visible = ( gridOrientation === GraphOrientations.VERTICAL );
      } );

      super( [

        // Sum
        new Node( {
          children: [ horizontalSumCheckbox, verticalSumCheckbox ]
        } ),

        // Values
        new ValuesCheckbox( valuesVisibleProperty ),

        // Grid
        new VectorAdditionGridCheckbox( gridVisibleProperty )
      ], options );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );