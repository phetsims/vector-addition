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
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );

  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  class Explore1DGraphControlPanel extends GraphControlPanel {

    /**
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorColorPalette} vectorColorPalette - color palette for vectors
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {Object} [options]
     */
    constructor( sumVisibleProperty, vectorColorPalette, valuesVisibleProperty, gridVisibleProperty, options ) {

      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette, 
        `invalid vectorColorPalette: ${vectorColorPalette}` );

      super( [

        // Sum
        new SumCheckbox( sumVisibleProperty, vectorColorPalette ),

        // Values
        new ValuesCheckbox( valuesVisibleProperty ),

        // Grid
        new VectorAdditionGridCheckbox( gridVisibleProperty )
      ], options );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );