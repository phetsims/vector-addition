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
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const GridCheckbox = require( 'VECTOR_ADDITION/common/view/GridCheckbox' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  class Explore1DGraphControlPanel extends GraphControlPanel {
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

      const content = new LayoutBox( {
        spacing: 10,
        align: 'left',
        orientation: 'vertical',
        children: [
          new SumCheckbox( sumVisibleProperty, vectorType ),
          new ValuesCheckbox( valuesVisibleProperty ),
          new GridCheckbox( gridVisibleProperty )
        ]
      } );

      super( content, options );
    }

  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );