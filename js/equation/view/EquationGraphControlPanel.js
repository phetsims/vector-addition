// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Equation' screen.
 *
 * Contains:
 *  - Values checkbox
 *  - Angle checkbox
 *  - Grid checkbox
 *  - Components label
 *  - ComponentStyleRadioButtonGroup
 *
 * Graph Control Panels are created at the start of the sim and are never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComponentStyleRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/ComponentStyleRadioButtonGroup' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const CONTROL_PANEL_LAYOUT_BOX_OPTIONS = VectorAdditionConstants.CONTROL_PANEL_LAYOUT_BOX_OPTIONS;
  const PANEL_WIDTH = VectorAdditionConstants.PANEL_OPTIONS.minWidth
                      - 2 * VectorAdditionConstants.PANEL_OPTIONS.xMargin;
  const VALUES_TEXT_LENGTH = PANEL_WIDTH - CHECKBOX_OPTIONS.boxWidth - CHECKBOX_OPTIONS.spacing;
  const COMPONENTS_TEXT_LENGTH = PANEL_WIDTH;

  class EquationGraphControlPanel extends Panel {
    /**
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>}
     * @param {Object} [options]
     */
    constructor( valuesVisibleProperty, angleVisibleProperty, gridVisibleProperty, componentStyleProperty, options ) {

      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      options = _.extend( {}, PANEL_OPTIONS, options );

      //----------------------------------------------------------------------------------------

      const componentStyleRadioButtonGroup = new ComponentStyleRadioButtonGroup( componentStyleProperty );

      const graphControlPanelContent = new VBox( _.extend( {}, CONTROL_PANEL_LAYOUT_BOX_OPTIONS, {
        children: [
          // values checkbox
          new Checkbox( new Text( valuesString, { font: PANEL_FONT, maxWidth: VALUES_TEXT_LENGTH } ),
            valuesVisibleProperty,
            CHECKBOX_OPTIONS ),

          // angles checkbox
          new Checkbox( VectorAdditionIconFactory.createAngleIcon(),
            angleVisibleProperty,
            CHECKBOX_OPTIONS ),

          // grid checkbox
          new Checkbox( VectorAdditionIconFactory.createGridIcon(),
            gridVisibleProperty,
            CHECKBOX_OPTIONS ),

          new Line( 0, 0, PANEL_WIDTH, 0, { stroke: VectorAdditionColors.BLACK } ),

          new Text( componentsString, { font: PANEL_FONT, maxWidth: COMPONENTS_TEXT_LENGTH } ),
          new AlignBox( componentStyleRadioButtonGroup, {
            alignBounds: new Bounds2( 0, 0, PANEL_WIDTH, componentStyleRadioButtonGroup.height ),
            maxWidth: PANEL_WIDTH,
            xAlign: 'center',
            yAlign: 'center'
          } )
        ]
      } ) );

      super( graphControlPanelContent, options );
    }
  }

  return vectorAddition.register( 'EquationGraphControlPanel', EquationGraphControlPanel );
} );