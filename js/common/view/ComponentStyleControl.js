// Copyright 2019, University of Colorado Boulder

/**
 * ComponentStyleControl is the control for selecting how to visually represent component vectors.
 * It consists of a labeled group of radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyleRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/ComponentStyleRadioButtonGroup' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );

  class ComponentStyleControl extends VBox {

    /**
     * @param {EnumerationProperty} componentStyleProperty - value of type ComponentStyles
     * @param {Object} [options]
     */
    constructor( componentStyleProperty, options ) {

      assert && assert( componentStyleProperty instanceof EnumerationProperty && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      options = _.extend( {
        align: 'left',
        spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
        maxWidth: 200
      }, options );

      const children = [];

      // 'Components' label, left justified
      const componentsText = new Text( componentsString, {
        font: VectorAdditionConstants.TITLE_FONT,
        maxWidth: options.maxWidth
      } );
      children.push( componentsText );

      // Radio buttons, centered in maxWidth by using an AlignBox
      const componentStyleRadioButtonGroup = new ComponentStyleRadioButtonGroup( componentStyleProperty );
      children.push( new AlignBox( componentStyleRadioButtonGroup, {
        alignBounds: new Bounds2( 0, 0, options.maxWidth, componentStyleRadioButtonGroup.height )
      } ) );

      assert && assert( !options.children, 'ComponentStyleControl sets children' );
      options.children = children;

      super( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'ComponentStyleControl is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'ComponentStyleControl', ComponentStyleControl );
} );