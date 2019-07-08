// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel at the top of the equation scene that allows the user to toggle the coefficients of vectors.
 *
 * 'Is a' relationship with ExpandCollapsePanel
 *    - when closed, displays TODO: what does it display?
 *    - when open displays a series of number pickers and formula nodes
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
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const ExpandCollapsePanel = require( 'VECTOR_ADDITION/common/view/ExpandCollapsePanel' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );

  //----------------------------------------------------------------------------------------
  // constants

  // fixed width and height of the panel
  const COEFFICIENT_PANEL_WIDTH = 210;
  const COEFFICIENT_PANEL_HEIGHT = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL_HEIGHT;

  // font for the panel
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // margin between the number picker and the label
  // const LABEL_PICKER_MARGIN = 5;

  const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;

  class CoefficientSelectorPanel extends ExpandCollapsePanel {
    /**
     * @constructor
     *
     * @param {EquationVectorSet} equationVectorSet
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Some options are
     *                             specific to this class while some are passed to the superclass. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( equationVectorSet, equationTypeProperty, options ) {

      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {

        // specific to this class
        top: 82,
        left: 165,

        contentXAlign: 'left',

        // super class options
        contentFixedWidth: COEFFICIENT_PANEL_WIDTH, // {number|null} fixed size of the panel (see superclass)
        contentFixedHeight: COEFFICIENT_PANEL_HEIGHT // {number|null} fixed size of the panel (see superclass)

      }, options );


      //----------------------------------------------------------------------------------------
      // Create the scenery node for when the panel is closed
      //----------------------------------------------------------------------------------------
      const closedNodeText = new FixedWidthText( 'TODO: what do we put here', {
        font: PANEL_FONT
      } );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes for when the panel is open
      //----------------------------------------------------------------------------------------

      // Create the content container for the open content
      const panelOpenContent = new HBox( {
        spacing: 15
      } );


      const numberPikersAndLabelHBoxes = [];

      equationVectorSet.vectors.forEach( vector => {
        const numberPiker = new NumberPicker( vector.coefficientProperty, vector.rangeProperty, NUMBER_PICKER_OPTIONS );
        const text = new FormulaNode( `\\vec{ \\mathrm{ ${vector.tag} } \}` );

        const hBox = new HBox( {
          spacing: 8,
          children: [ numberPiker, text ]
        } );

        numberPikersAndLabelHBoxes.push( hBox );

      } );

      const signs = [];

      const children = _.flatMap( numberPikersAndLabelHBoxes, ( value, index, array ) => {
        if ( index !== array.length - 1 ) {
          const sign = new FixedWidthText( '', { font: PANEL_FONT } );
          signs.push( sign );
          return [ value, sign ];
        }
        else {
          return value;
        }
      } );

      const right = new HBox( {
        spacing: 15
      } );


      panelOpenContent.setChildren( children );
      panelOpenContent.addChild( right );

      equationTypeProperty.link( equationType => {

        if ( equationType === EquationTypes.ADDITION ) {
          signs.forEach( sign => {
            sign.setText( '+' );
          } );

          right.children.forEach( ( child ) => {
            child.dispose();
          } );
          right.setChildren( [ new FixedWidthText( '=', { font: PANEL_FONT } ), new FormulaNode( `\\vec{ \\mathrm{ ${equationVectorSet.vectorSum.tag} } \}` ) ] );
        }

        else if ( equationType === EquationTypes.NEGATION ) {
          signs.forEach( sign => {
            sign.setText( '+' );
          } );

          right.children.forEach( ( child ) => {
            child.dispose();
          } );
          right.setChildren( [ new FixedWidthText( '+', { font: PANEL_FONT } ), new FormulaNode( `\\vec{ \\mathrm{ ${equationVectorSet.vectorSum.tag} } \}` ), new FixedWidthText( '=', { font: PANEL_FONT } ), new FixedWidthText( '0', { font: PANEL_FONT } ) ] );
        }
        else if ( equationType === EquationTypes.SUBTRACTION ) {
          signs.forEach( sign => {
            sign.setText( '-' );
          } );

          right.children.forEach( ( child ) => {
            child.dispose();
          } );
          right.setChildren( [ new FixedWidthText( '=', { font: PANEL_FONT } ), new FormulaNode( `\\vec{ \\mathrm{ ${equationVectorSet.vectorSum.tag} } \}` ) ] );
        }


      } );
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

      this.top = options.top;
      this.left = options.left;
    }
  }


  class FixedWidthText extends AlignBox {

    constructor( textString, textOptions, width = 5 ) {


      super( new Text( textString, textOptions ), {
        alignBounds: new Bounds2( 0, 0, width, COEFFICIENT_PANEL_HEIGHT ),
        maxWidth: width
      } );
    }

    setText( text ) {
      this.children[ 0 ].setText( text );
    }
  }

  return vectorAddition.register( 'CoefficientSelectorPanel', CoefficientSelectorPanel );
} );