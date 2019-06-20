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
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const RADIO_BUTTON_OPTIONS = _.extend( VectorAdditionColors.RADIO_BUTTON_COLORS, {
    disabledBaseColor: 'rgb( 100, 100, 100)',
    selectedStroke: '#419ac9',
    deselectedStroke: 'rgb( 50, 50, 50 )',
    deselectedLineWidth: 1,
    cornerRadius: 6,
    deselectedButtonOpacity: 0.4,
    yMargin: 6,
    xMargin: 6
  } );

  class ComponentStyleRadioButtonGroup extends Node {

    /**
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     * @constructor
     */
    constructor( componentStyleProperty, options ) {

      assert && assert( componentStyleProperty instanceof Property
      && ComponentStyles.includes( componentStyleProperty.value ),
      `invalid componentStyleProperty: ${componentStyleProperty}` );
  
      //----------------------------------------------------------------------------------------
      // Create the icons
      const invisibleIcon = VectorAdditionIconFactory.createInvisibleComponentStyleIcon();
      const parallelogramIcon = VectorAdditionIconFactory.createParallelogramComponentStyleIcon();
      const triangleIcon =  VectorAdditionIconFactory.createTriangleComponentStyleIcon();
      const onAxisIcon = VectorAdditionIconFactory.createAxisIconComponentStyleIcon();

      const icons = [ invisibleIcon, parallelogramIcon, triangleIcon, onAxisIcon ];

      //----------------------------------------------------------------------------------------
      // Gather the options and the max width
      options = _.extend( _.clone( RADIO_BUTTON_OPTIONS ), options );

      // Get the largest width / height
      const widestContentWidth = _.maxBy( icons, node => node.width ).width + 2 * options.xMargin;
      const tallestContentHeight = _.maxBy( icons, node => node.height ).height + 2 * options.yMargin;

      options = _.extend( options, {
        maxWidth: widestContentWidth,
        minWidth: widestContentWidth,
        maxHeight: tallestContentHeight,
        minHeight: tallestContentHeight
      } );

      //----------------------------------------------------------------------------------------
      // Create the Radio Buttons
      const invisibleButton = new RadioButtonGroupMember( componentStyleProperty, ComponentStyles.INVISIBLE, _.extend( {
        content: invisibleIcon
       }, options ) );
      const parallelogramButton = new RadioButtonGroupMember( componentStyleProperty, ComponentStyles.PARALLELOGRAM,
        _.extend( {
          content: parallelogramIcon
         }, options ) );
      const triangleButton = new RadioButtonGroupMember( componentStyleProperty, ComponentStyles.TRIANGLE,
        _.extend( {
          content: triangleIcon
         }, options ) );
      const onAxisButton = new RadioButtonGroupMember( componentStyleProperty, ComponentStyles.ON_AXIS,
        _.extend( {
          content: onAxisIcon
         }, options ) );

      super( {
        children: [ new GridLayoutBox( [ invisibleButton, parallelogramButton, triangleButton, onAxisButton ] ) ]
      } );

    }
  }

  //----------------------------------------------------------------------------------------

  class GridLayoutBox extends LayoutBox {
    /**
     * @constructor
     * @param {Array.<Node>} content
     * @param {Object} [options]
     * Create a grid layout box
     */
    constructor( content, options ) {

      options = _.extend( {
        rows: 2, // {number}
        cols: 2, // {number}
        horizontalSpacing: 5, // {number}
        verticalSpacing: 5, // {number}
        horizontalOptions: null, // {null} see defaults below
        verticalOptions: null // {null} see defaults below
      }, options );

      options.verticalOptions = _.extend( {
        align: 'center'
      }, options.verticalOptions );

      options.horizontalOptions = _.extend( {
        align: 'center'
      }, options.horizontalOptions );

      //----------------------------------------------------------------------------------------
      super( _.extend( {
        spacing: options.verticalSpacing,
        orientation: 'vertical'
      }, options.verticalOptions ) );
    

      // Convenience references
      const rows = options.rows;
      const cols = options.cols;
  

      //----------------------------------------------------------------------------------------
      // Check arguments
      assert && assert( typeof rows === 'number' && typeof cols === 'number',
        `invalid rows: ${rows} and cols: ${cols}`);
      assert && assert( content && rows * cols === content.length,
        `content doesn't match rows and cols: ${content}` );
      assert && assert( content.filter( node => !( node instanceof Node ) ).length === 0,
        `invalid content: ${content}` );

      //----------------------------------------------------------------------------------------
      // Loop through each node and add it to the grid
      let contentIndex = 0;

      for ( let row = 0; row < rows; row++ ) {

        const horizontalLayout = new LayoutBox( _.extend( {
          spacing: options.horizontalSpacing,
          orientation: 'horizontal'
        }, options.horizontalOptions ) );

        for ( let col = 0; col < cols; col++ ) {

          const node = content[ contentIndex ];

          horizontalLayout.addChild( node );

          contentIndex ++;
        }
        this.addChild( horizontalLayout );
      }
    }

  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );