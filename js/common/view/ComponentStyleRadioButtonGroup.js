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
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const RADIO_BUTTON_OPTIONS = _.extend( {
    selectedLineWidth: 2,
    right: 900,
    top: 100,
    cornerRadius: 6,
    orientation: 'horizontal'
  }, VectorAdditionColors.RADIO_BUTTON_COLORS );

  class ComponentStyleRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty<ComponentStyles>} componentStyleProperty 
     * @constructor
     */
    constructor( componentStyleProperty ) {

      const componentStyleRadioButtonContent = [ {
        value: ComponentStyles.INVISIBLE,
        node: VectorAdditionIconFactory.createInvisibleComponentStyleIcon()
      }, {
        value: ComponentStyles.PARALLELOGRAM,
        node: VectorAdditionIconFactory.createParallelogramComponentStyleIcon()
      }, {
        value: ComponentStyles.TRIANGLE,
        node: VectorAdditionIconFactory.createTriangleComponentStyleIcon()
      }, {
        value: ComponentStyles.ON_AXIS,
        node: VectorAdditionIconFactory.createAxisIconComponentStyleIcon()
      } ];

      super( componentStyleProperty, componentStyleRadioButtonContent, RADIO_BUTTON_OPTIONS );
    }
  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );