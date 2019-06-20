// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore2D' screen.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const AngleCheckbox = require( 'VECTOR_ADDITION/common/view/AngleCheckbox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyleRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/ComponentStyleRadioButtonGroup' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GridCheckbox = require( 'VECTOR_ADDITION/common/view/GridCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Line = require( 'SCENERY/nodes/Line' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const FixedWidthNode = require( 'VECTOR_ADDITION/common/view/FixedWidthNode' );
  const Panel = require( 'SUN/Panel' );

  // constants
  const PANEL_WIDTH = VectorAdditionConstants.PANEL_WIDTH;
  const componentsString = require( 'string!VECTOR_ADDITION/components' );

  class Explore2DGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {BooleanProperty} sumVisibleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorTypes} vectorType
     * @param {Object} [options]
     */
    constructor(
      sumVisibleProperty,
      valuesVisibleProperty,
      angleVisibleProperty,
      gridVisibleProperty,
      componentStyleProperty,
      vectorType,
      options ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorTypes.includes( vectorType ), `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( VectorAdditionConstants.PANEL_OPTIONS, options );

      const content = new FixedWidthNode( PANEL_WIDTH, new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          new SumCheckbox( sumVisibleProperty, vectorType ),
          new ValuesCheckbox( valuesVisibleProperty ),
          new AngleCheckbox( angleVisibleProperty ),
          new GridCheckbox( gridVisibleProperty ),
          new Line( 0, 0, VectorAdditionConstants.PANEL_WIDTH, 0, {
            stroke: VectorAdditionColors.GRAPH_CONTROL_PANEL_LINE_COLOR
          } ),
          new Text( componentsString, {
            font: VectorAdditionConstants.PANEL_FONT
          } ),
          new ComponentStyleRadioButtonGroup( componentStyleProperty )
        ]
      } ) );

      super( content, options );
    }

  }

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );