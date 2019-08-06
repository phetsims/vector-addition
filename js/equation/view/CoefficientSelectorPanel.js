// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel at the top of the equation scene that allows the user to toggle the coefficients of vectors.
 *
 * 'Is a' relationship with ExpandCollapsePanel
 *    - when closed, displays 'Equation'
 *    - when open, displays a series of number pickers and formula nodes
 *
 * A visual:
 *  https://user-images.githubusercontent.com/42391580/60623943-4128d000-9da1-11e9-9dc0-393bfa332117.png
 *
 * This panel exists for the entire sim and is never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const ExpandCollapsePanel = require( 'VECTOR_ADDITION/common/view/ExpandCollapsePanel' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  //----------------------------------------------------------------------------------------
  // constants

  // fixed width and height of the panel
  const COEFFICIENT_PANEL_WIDTH = 210;
  const COEFFICIENT_PANEL_HEIGHT = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL_HEIGHT;

  // font for the panel
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // margin between the number picker and the label
  const LABEL_PICKER_MARGIN = 8;

  const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;

  const SIGN_TEXT_LENGTH = 5;


  class CoefficientSelectorPanel extends ExpandCollapsePanel {
    /**
     * @param {EquationVectorSet} equationVectorSet
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {Object} [options]
     */
    constructor( equationVectorSet, equationType, options ) {

      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {

        // specific to this class
        centerY: 70,
        left: 165,

        // super class options
        contentFixedWidth: COEFFICIENT_PANEL_WIDTH, // {number|null} fixed size of the panel (see superclass)
        contentFixedHeight: COEFFICIENT_PANEL_HEIGHT, // {number|null} fixed size of the panel (see superclass)
        contentXAlign: 'left'

      }, options );


      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed
      //----------------------------------------------------------------------------------------
      const closedNodeText = new Text( 'Equation', {
        font: PANEL_FONT
      } );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open
      //----------------------------------------------------------------------------------------

      // Create the content container for the open content
      const panelOpenContent = new HBox( {
        spacing: 15
      } );

      // Create an array of number HBoxes that contain a number picker and a label
      const hBoxesChildren = [];

      // Loop through each vector add add a number picker / label
      equationVectorSet.vectors.forEach( vector => {

        const coefficientProperty = vector.coefficientProperty;

        const numberPicker = new NumberPicker( coefficientProperty,
          new Property( new Range( -5, 5 ) ),
          NUMBER_PICKER_OPTIONS );

        // Create the label
        const text = new FormulaNode( `\\vec{${vector.symbol}\}` );

        const numberPickerAndTextBox = new HBox( {
          spacing: LABEL_PICKER_MARGIN,
          children: [ numberPicker, text ]
        } );

        hBoxesChildren.push( numberPickerAndTextBox );
      } );


      // Array of the text nodes that indicate sign (ie. + or - )
      const signTextNodes = [];

      // Insert 'signs' ( +/- ) in between each h box
      const panelOpenContentChildren = _.flatMap( hBoxesChildren, ( value, index ) => {
        if ( index !== hBoxesChildren.length - 1 ) {

          let sign;

          if ( equationType === EquationTypes.ADDITION || equationType === EquationTypes.NEGATION ) {
            sign = '+';
          }
          else {
            sign = '-';
          }

          // Align the text inside align box
          const signTextNode = new AlignBox( new Text( sign, { font: PANEL_FONT } ), {
            alignBounds: new Bounds2( 0, 0, SIGN_TEXT_LENGTH, COEFFICIENT_PANEL_HEIGHT ),
            maxWidth: SIGN_TEXT_LENGTH
          } );

          signTextNodes.push( signTextNode );
          return [ value, signTextNode ];
        }
        else {
          return value;
        }
      } );

      const equalsText = new Text( '=', { font: PANEL_FONT } );

      const sumText = new FormulaNode( `\\vec{${equationVectorSet.vectorSum.symbol}\}` );

      // Add the second half of the equation
      if ( equationType === EquationTypes.ADDITION || equationType === EquationTypes.SUBTRACTION ) {
        panelOpenContentChildren.push( equalsText, sumText );
      }
      else if ( equationType === EquationTypes.NEGATION ) {
        const plusText = new AlignBox( new Text( '+', { font: PANEL_FONT } ), {
          alignBounds: new Bounds2( 0, 0, SIGN_TEXT_LENGTH, COEFFICIENT_PANEL_HEIGHT ),
          maxWidth: SIGN_TEXT_LENGTH
        } );

        const zeroText = new AlignBox( new Text( '0', { font: PANEL_FONT } ), {
          alignBounds: new Bounds2( 0, 0, SIGN_TEXT_LENGTH, COEFFICIENT_PANEL_HEIGHT ),
          maxWidth: SIGN_TEXT_LENGTH
        } );

        panelOpenContentChildren.push( plusText, sumText, equalsText, zeroText );
      }

      panelOpenContent.setChildren( panelOpenContentChildren );

      //----------------------------------------------------------------------------------------
      // Create the inspect a vector panel
      //----------------------------------------------------------------------------------------

      super( closedNodeText, panelOpenContent, {
        contentFixedWidth: options.contentFixedWidth,
        contentFixedHeight: options.contentFixedHeight,
        contentXAlign: options.contentXAlign
      } );

      //----------------------------------------------------------------------------------------
      // Layout the inspect vector panel
      //----------------------------------------------------------------------------------------

      this.centerY = options.centerY;
      this.left = options.left;
    }
  }

  return vectorAddition.register( 'CoefficientSelectorPanel', CoefficientSelectorPanel );
} );