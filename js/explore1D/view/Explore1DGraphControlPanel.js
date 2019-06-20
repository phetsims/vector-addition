// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore1D' screen.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const GridCheckbox = require( 'VECTOR_ADDITION/common/view/GridCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const FixedWidthNode = require( 'VECTOR_ADDITION/common/view/FixedWidthNode' );
  const Panel = require( 'SUN/Panel' );

  // constants
  const PANEL_WIDTH = VectorAdditionConstants.PANEL_WIDTH;

  class Explore1DGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {BooleanProperty} sumVisibleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {VectorTypes} vectorType
     * @param {Object} [options]
     */
    constructor( sumVisibleProperty, valuesVisibleProperty, gridVisibleProperty, vectorType, options ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( VectorTypes.includes( vectorType ), `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( VectorAdditionConstants.PANEL_OPTIONS, options );


      const content = new FixedWidthNode( PANEL_WIDTH, new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          new SumCheckbox( sumVisibleProperty, vectorType ),
          new ValuesCheckbox( valuesVisibleProperty ),
          new GridCheckbox( gridVisibleProperty )
        ]
      } ) );

      super( content, options );
    }

  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );