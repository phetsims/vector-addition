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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const FixedWidthNode = require( 'VECTOR_ADDITION/common/view/FixedWidthNode' );

  // constants
  const PANEL_WIDTH = VectorAdditionConstants.PANEL_WIDTH;
  const RADIO_BUTTON_OPTIONS = _.extend( {
    deselectedLineWidth: 1,
    cornerRadius: VectorAdditionConstants.PANEL_OPTIONS.cornerRadius,
    deselectedButtonOpacity: 0.4,
    yMargin: 4.5,
    xMargin: 4.5
  }, VectorAdditionColors.RADIO_BUTTON_COLORS );

  class ComponentStyleRadioButtonGroup extends FixedWidthNode {

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
      // Get the largest icon
      const icons = [];

      ComponentStyles.VALUES.forEach( componentStyle => {
        icons.push( VectorAdditionIconFactory.createComponentStyleIcon( componentStyle ) );
      } );

      //----------------------------------------------------------------------------------------
      // Gather the options and the max width
      options = _.extend( {}, RADIO_BUTTON_OPTIONS, options );

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
      const radioButtons = [];

      ComponentStyles.VALUES.forEach( componentStyle => {

        const button =  new RadioButtonGroupMember( componentStyleProperty, componentStyle, _.extend( {
          content: VectorAdditionIconFactory.createComponentStyleIcon( componentStyle )
        }, options ) );

        radioButtons.push( button );
      } );


      super( PANEL_WIDTH, new GridLayoutBox( radioButtons ), {
        align: 'center'
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
        horizontalSpacing: 8, // {number}
        verticalSpacing: 8, // {number}
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
        `invalid rows: ${rows} and cols: ${cols}` );
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

          contentIndex++;
        }
        this.addChild( horizontalLayout );
      }
    }

  }

  return vectorAddition.register( 'ComponentStyleRadioButtonGroup', ComponentStyleRadioButtonGroup );
} );