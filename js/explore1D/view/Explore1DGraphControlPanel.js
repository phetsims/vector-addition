// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore1D' screen.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Panel = require( 'SUN/Panel' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  // strings
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  class Explore1DGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {BooleanProperty} sumVisibleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {VectorGroups} vectorGroup
     * @param {Object} [options]
     */
    constructor( sumVisibleProperty, valuesVisibleProperty, gridVisibleProperty, vectorGroup, options ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, PANEL_OPTIONS, options );

      const content = new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          new SumCheckbox( sumVisibleProperty, vectorGroup ),
          // values checkbox
          new Checkbox( new Text( valuesString, { font: PANEL_FONT } ),
            valuesVisibleProperty,
            CHECKBOX_OPTIONS ),

                // grid checkbox
          new Checkbox( VectorAdditionIconFactory.createGridIcon(),
            gridVisibleProperty,
            CHECKBOX_OPTIONS )
        ]
      } );

      super( content, options );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );