// Copyright 2019, University of Colorado Boulder

/**
 * ComponentStyleRadioButtonGroup is a group of radio buttons, arranged in a grid, for selecting component style.
 * It does not use RadioButtonGroup, because that class does not support a grid layout.
 * See https://github.com/phetsims/sun/issues/513 for context.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const GridLayoutBox = require( 'VECTOR_ADDITION/common/view/GridLayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class ComponentStyleRadioButtonGroup extends Node {

    /**
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    constructor( componentStyleProperty ) {

      assert && assert( componentStyleProperty instanceof Property && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      // Create the radio buttons
      const buttons = [];
      ComponentStyles.VALUES.forEach( componentStyle => {
        buttons.push( new RadioButtonGroupMember( componentStyleProperty, componentStyle,
          _.extend( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
            content: VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentStyle )
          } ) ) );
      } );

      // Arrange the buttons in a grid
      const gridLayoutBox = new GridLayoutBox( {
        children: buttons,
        columns: 2
      } );

      super( {
        children: [ gridLayoutBox ]
      } );
    }
  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );