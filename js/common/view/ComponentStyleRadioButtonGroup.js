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
  const Node = require( 'SCENERY/nodes/Node' );
  const RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );

  // constants
  const RADIO_BUTTON_OPTIONS = _.extend( VectorAdditionColors.RADIO_BUTTON_COLORS, {
    minWidth: 50, // TODO, calculate the max width in code
    maxWidth: 50,
    minHeight: 45,
    maxHeight: 45,
    
    disabledBaseColor: 'rgb( 100, 100, 100)',

    selectedStroke: '#419ac9',
    deselectedStroke: 'rgb( 50, 50, 50 )',
    deselectedLineWidth: 1,

    cornerRadius: 6,
    deselectedButtonOpacity: 0.4
  } );

  class ComponentStyleRadioButtonGroup extends Node {

    /**
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @constructor
     */
    constructor( componentStyleProperty ) {

      const invisibleButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.INVISIBLE, _.extend( {

          content: VectorAdditionIconFactory.createInvisibleComponentStyleIcon()
         }, _.clone( RADIO_BUTTON_OPTIONS ) ) );

      const parallelogramButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.PARALLELOGRAM, _.extend( {

          content: VectorAdditionIconFactory.createParallelogramComponentStyleIcon()
         }, _.clone( RADIO_BUTTON_OPTIONS ) ) );

      const triangleButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.TRIANGLE, _.extend( {

          content: VectorAdditionIconFactory.createTriangleComponentStyleIcon()
         }, _.clone( RADIO_BUTTON_OPTIONS ) ) );

      const onAxisButton = new RadioButtonGroupMember(
        componentStyleProperty,
        ComponentStyles.ON_AXIS, _.extend( {
          content: VectorAdditionIconFactory.createAxisIconComponentStyleIcon()
        }, _.clone( RADIO_BUTTON_OPTIONS ) ) );


      super( {
        children: [ new GridLayoutBox( [ invisibleButton, parallelogramButton, triangleButton, onAxisButton ] ) ]
      } );

    }
  }

  //----------------------------------------------------------------------------------------

  class GridLayoutBox extends LayoutBox {
    /**
     * @constructor
     * @param [options]
     * Create a grid layout box
     */
    constructor( content, options ) {

      options = _.extend( {
        rows: 2,
        cols: 2,
        horizontalSpacing: 5,
        verticalSpacing: 5,
        horizontalOptions: {
          align: 'center'
        },
        verticalOptions: {
          align: 'center'
        }
      }, options );

      super( _.extend( {
        spacing: options.verticalSpacing,
        orientation: 'vertical'
      }, options.verticalOptions ) );
    
      const rows = options.rows;
      const cols = options.cols;

      assert && assert( typeof rows === 'number' && typeof cols === 'number',
        `invalid rows: ${rows} and cols: ${cols}`);
      assert && assert( content && rows * cols === content.length,
        `content doesn't match rows and cols: ${content}` );
      //----------------------------------------------------------------------------------------

      content.forEach( ( node ) => {

        assert && assert( node instanceof Node, `invalid content: ${content}` );


      } );
      let contentIndex = 0;

      for ( let row = 0; row < rows; row++ ) {

        const horizontalLayout = new LayoutBox( _.extend( {
          spacing: options.horizontalSpacing,
          orientation: 'horizontal'
        }, options.horizontalOptions ) );

        for ( let col = 0; col < cols; col++ ) {

          const node = content[ contentIndex ];

          horizontalLayout.addChild( node );

          contentIndex++;
        }
        this.addChild( horizontalLayout );
      }
    }

  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );