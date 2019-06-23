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
  const Line = require( 'SCENERY/nodes/Line' );
  const Panel = require( 'SUN/Panel' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );

  class Explore2DGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {BooleanProperty} sumVisibleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorGroups} vectorGroup
     * @param {Object} [options]
     */
    constructor(
      sumVisibleProperty,
      valuesVisibleProperty,
      angleVisibleProperty,
      gridVisibleProperty,
      componentStyleProperty,
      vectorGroup,
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
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( PANEL_OPTIONS, options );


      const content = new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          new SumCheckbox( sumVisibleProperty, vectorGroup ),
          new ValuesCheckbox( valuesVisibleProperty ),
          new AngleCheckbox( angleVisibleProperty ),
          new GridCheckbox( gridVisibleProperty ),
          new Line( 0, 0, PANEL_OPTIONS.contentWidth, 0, {
            stroke: VectorAdditionColors.GRAPH_CONTROL_PANEL_LINE_COLOR
          } ),
          new Text( componentsString, {
            font: PANEL_FONT
          } ),
          new ComponentStyleRadioButtonGroup( componentStyleProperty )
        ]
      } );

      super( content, options );
    }

  }

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );