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

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );

  class LabGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {BooleanProperty} sum1VisibleProperty - visibility of sum for group 1 vector set
     * @param {BooleanProperty} sum2VisibleProperty - visibility of sum for group 2 vector set
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor(
      sum1VisibleProperty,
      sum2VisibleProperty,
      valuesVisibleProperty,
      angleVisibleProperty,
      gridVisibleProperty,
      componentStyleProperty,
      options ) {

      // Type check arguments
      // assert && assert( sumVisibleProperty instanceof BooleanProperty,
      //   `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      // assert && assert( VectorTypes.includes( vectorType ), `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( VectorAdditionConstants.PANEL_OPTIONS, options );

      const content = new FixedWidthNode( PANEL_WIDTH, new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          new SumCheckbox( sum1VisibleProperty, VectorTypes.ONE ),
          new SumCheckbox( sum2VisibleProperty, VectorTypes.TWO ),
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

  return vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );
} );