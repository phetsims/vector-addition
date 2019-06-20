// Copyright 2019, University of Colorado Boulder

/**
 * Radio Button Group for the component styles
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const RadioButtonGroupAppearance = require( 'SUN/buttons/RadioButtonGroupAppearance' );
  const RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );

  // constants
  const RADIO_BUTTON_OPTIONS = _.extend( {

    disabledBaseColor: 'rgb( 100, 100, 100)',

    // Opacity can be set separately for the buttons and button content.
    selectedButtonOpacity: 1,
    deselectedButtonOpacity: 0.4,
    selectedContentOpacity: 1,
    deselectedContentOpacity: 0.4,
    overButtonOpacity: 0.8,
    overContentOpacity: 0.8,

    selectedStroke: '#419ac9',
    deselectedStroke: 'rgb( 50, 50, 50 )',
    deselectedLineWidth: 1,

    // The following options specify highlight behavior overrides, leave as null to get the default behavior
    // Note that highlighting applies only to deselected buttons
    overFill: null,
    overStroke: null,
    overLineWidth: null,

    // These margins are *within* each button
    buttonContentXMargin: 5,
    buttonContentYMargin: 5,

    // alignment of the content nodes *within* each button
    buttonContentXAlign: 'center', // {string} see BUTTON_CONTENT_X_ALIGN_VALUES
    buttonContentYAlign: 'center', // {string} see BUTTON_CONTENT_Y_ALIGN_VALUES

    // TouchArea expansion
    touchAreaXDilation: 0,
    touchAreaYDilation: 0,

    // MouseArea expansion
    mouseAreaXDilation: 0,
    mouseAreaYDilation: 0,

    // How far from the button the text label is (only applies if labels are passed in)
    labelSpacing: 0,

    // Which side of the button the label will appear, options are 'top', 'bottom', 'left', 'right'
    // (only applies if labels are passed in)
    labelAlign: 'bottom',

    // The default appearances use the color values specified above, but other appearances could be specified for more
    // customized behavior.  Generally setting the color values above should be enough to specify the desired look.
    buttonAppearanceStrategy: RadioButtonGroupAppearance.defaultRadioButtonsAppearance,
    contentAppearanceStrategy: RadioButtonGroupAppearance.contentAppearanceStrategy,

    // a11y - focus highlight expansion
    a11yHighlightXDilation: 0,
    a11yHighlightYDilation: 0,
    selectedLineWidth: 1,
    cornerRadius: 6
  }, VectorAdditionColors.RADIO_BUTTON_COLORS, {
    minWidth: 50,
    maxWidth: 50,
    minHeight: 45,
    maxHeight: 45
  } );

  class ComponentStyleRadioButtonGroup extends LayoutBox {

    /**
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @constructor
     */
    constructor( componentStyleProperty ) {

      super( {
        align: 'center',
        spacing: 5
      } );

      const horizontal = new LayoutBox( {
        align: 'center',
        spacing: 5,
        orientation: 'horizontal'
      } );
      const horizontal2 = new LayoutBox( {
        align: 'center',
        spacing: 5,
        orientation: 'horizontal'
      } );

      const invisibleButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.INVISIBLE, _.extend( {
          content: VectorAdditionIconFactory.createInvisibleComponentStyleIcon()
        }, RADIO_BUTTON_OPTIONS ) );

      const parallelogramButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.PARALLELOGRAM, _.extend( {
          content: VectorAdditionIconFactory.createParallelogramComponentStyleIcon()

        }, RADIO_BUTTON_OPTIONS ) );
      const triangleButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.TRIANGLE, _.extend( {
          content: VectorAdditionIconFactory.createTriangleComponentStyleIcon()
        }, RADIO_BUTTON_OPTIONS ) );

      const onAxisButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.ON_AXIS, _.extend( {
          content: VectorAdditionIconFactory.createAxisIconComponentStyleIcon()
        }, RADIO_BUTTON_OPTIONS ) );


      this.setChildren( [ horizontal.setChildren( [ invisibleButton, parallelogramButton ] ),
        horizontal2.setChildren( [ triangleButton, onAxisButton ] ) ] );


    }
  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );