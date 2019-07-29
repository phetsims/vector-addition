// Copyright 2019, University of Colorado Boulder

/**
 * Radio Button Group for the component styles.
 *
 * See https://github.com/phetsims/sun/issues/513 for context.
 *
 * ## Temporary solution to create a Radio Button Group in a Grid Layout:
 *  - Uses `RadioButtonGroupMember` to create individual radio buttons
 *  - Inserts `RadioButtonGroupMember` into a series of HBoxes, which are inserted into a VBox
 *  - Although `ComponentStyleRadioButtonGroup` extends Node, it is still called a 'radio button group' since
 *    it mimics the behavior of the RadioButtonGroup
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const RADIO_BUTTON_OPTIONS = VectorAdditionConstants.RADIO_BUTTON_OPTIONS;

  class ComponentStyleRadioButtonGroup extends Node {

    /**
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( componentStyleProperty, options ) {

      assert && assert( componentStyleProperty instanceof Property
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {}, RADIO_BUTTON_OPTIONS, options );

      //----------------------------------------------------------------------------------------
      const radioButtonsContent = [];

      ComponentStyles.VALUES.forEach( componentStyle => {

        const button = new RadioButtonGroupMember( componentStyleProperty, componentStyle, _.extend( {
          content: VectorAdditionIconFactory.createComponentStyleRadioButtonIcon( componentStyle )
        }, options ) );

        radioButtonsContent.push( new AlignBox( button, {
          alignBounds: new Bounds2( 0, 0, button.width, button.height )
        } ) );
      } );

      super( { children: [ new GridLayoutBox( radioButtonsContent ) ] } );
    }
  }

  //----------------------------------------------------------------------------------------

  class GridLayoutBox extends LayoutBox {

    /**
     * @param {Array.<Node>} content
     * @param {Object} [options]
     */
    constructor( content, options ) {

      assert && assert( content.filter( node => node instanceof Node ).length === content.length,
        `invalid content: ${content}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        rows: 2, // {number} - number of rows
        cols: 2, // {number} - number of columns
        horizontalSpacing: 8, // {number} - spacing between each column
        verticalSpacing: 8, // {number} - spacing between each row
        xAlign: 'center', // {string} - 'left' || 'center', 'right'
        yAlign: 'center' // {string} - 'top' || 'center', 'bottom'
      }, options );

      super( {
        spacing: options.verticalSpacing,
        align: options.yAlign
      } );

      // Convenience references
      const rows = options.rows;
      const cols = options.cols;

      //----------------------------------------------------------------------------------------

      assert && assert( typeof rows === 'number' && typeof cols === 'number',
        `invalid rows: ${rows} and cols: ${cols}` );
      assert && assert( content && rows * cols === content.length,
        `content doesn't match rows and cols: ${content}` );
      assert && assert( content.filter( node => !( node instanceof Node ) ).length === 0,
        `invalid content: ${content}` );

      //----------------------------------------------------------------------------------------
      // Loop through each node and add it to the grid
      let contentIndex = 0;

      for ( let row = 0; row < rows; row++ ) {

        const horizontalLayout = new LayoutBox( {
          spacing: options.horizontalSpacing,
          orientation: 'horizontal',
          align: options.xAlign
        } );

        for ( let col = 0; col < cols; col++ ) {
          horizontalLayout.addChild( content[ contentIndex ] );
          contentIndex++;
        }

        this.addChild( horizontalLayout );
      }
    }
  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );