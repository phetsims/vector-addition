// Copyright 2019, University of Colorado Boulder

/**
 * View for the Accordion Box that appears on the right side of the 'Equation' screen.
 *
 * 'Is a' relationship with AccordionBox but adds the following functionality:
 *  - allow users to change the components of the Vectors on cartesian mode (via numberPicker)
 *  - allow users to change the angle and the magnitude of the Vectors on polar mode (via numberPicker)
 *  - allow users to toggle the visibility of the Base Vectors (via checkbox)
 *
 * See https://user-images.githubusercontent.com/42391580/62811621-9bfbc880-babf-11e9-99b4-5fec8f25b84b.png for a visual
 *
 * This AccordionBox is not meant to be disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Checkbox = require( 'SUN/Checkbox' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // strings
  const baseVectorsString = require( 'string!VECTOR_ADDITION/baseVectors' );
  const showBaseVectorsString = require( 'string!VECTOR_ADDITION/showBaseVectors' );
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );

  //----------------------------------------------------------------------------------------
  // constants

  // Checkbox options for the 'Show Base Vectors' checkbox
  const CHECKBOX_OPTIONS = _.extend( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, { spacing: 3.5 } );

  // font for the title of the AccordionBox ('Base Vectors') and the Base Vectors visible checkbox label
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // interval spacing of vector angle (in degrees) when vector is in polar mode
  const POLAR_ANGLE_INTERVAL = VectorAdditionConstants.POLAR_ANGLE_INTERVAL;

  // tentative ranges on Number Pickers
  const COMPONENT_RANGE = new Range( -10, 10 );
  const ANGLE_RANGE = new Range( -180, 180 );
  const MAGNITUDE_RANGE = new Range( -10, 10 );


  class BaseVectorsAccordionBox extends AccordionBox {

    /**
     * @param {BooleanProperty} baseVectorsVisibleProperty
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @param {EquationVectorSet} equationVectorSet
     * @param {Object} [options]
     */
    constructor( baseVectorsVisibleProperty, coordinateSnapMode, equationVectorSet, options ) {

      assert && assert( baseVectorsVisibleProperty instanceof BooleanProperty,
        `invalid baseVectorsVisibleProperty: ${baseVectorsVisibleProperty}` );
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, {

        // specific to this class
        numberPickerWithLabelsSpacing: 11, // {number} spacing between the left Number Picker and the right label
        contentSpacing: 13,                // {number} spacing between the first row of NumberPickers and the second
        fixedWidth: 170,                   // {number} fixed width of the Accordion Box

        // super class options
        titleNode: new Text( baseVectorsString, { font: PANEL_FONT } ),
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: 270

        // The rest of the options are in VectorAdditionConstants.ACCORDION_BOX_OPTIONS
      }, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, options );


      // Assign a max width of the title node. Calculated by taking the total width and subtracting everything that
      // isn't the title
      options.titleNode.maxWidth = options.fixedWidth       // total width
                                   - options.titleXMargin   // margin between the title right edge
                                   - options.titleXSpacing  // space between the title and the button
                                   - options.expandCollapseButtonOptions.sideLength // button size
                                   - options.buttonXMargin; // margin between the button and the left edge


      //----------------------------------------------------------------------------------------
      // Convenience reference of the width of the content inside the Accordion Box
      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );


      //----------------------------------------------------------------------------------------
      // Create the Number Pickers / labels
      //
      // Each Vector in the equationVectorSet gets 2 Number Pickers displayed horizontally. Each Number Picker has
      // a 'label'.
      //
      // On Cartesian, the two Number Pickers toggle the X and the Y component respectively.
      // On Polar, the two Number Pickers toggle the magnitude and the angle respectively.
      //----------------------------------------------------------------------------------------

      const accordionBoxContentChildren = []; // empty (for now) array of the children of the content

      // Each Vector in the equationVectorSet gets 2 NumberPickers, so loop through the equationVectorSet
      equationVectorSet.vectors.forEach( equationVector => {

        const baseVector = equationVector.baseVector; // convenience reference

        // Empty references to the 2 NumberPickers/labels per Vector. To be set later.
        let leftNumberPickerAndLabel;
        let rightNumberPickerAndLabel;

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

          // X Component
          leftNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.xComponentProperty,
            COMPONENT_RANGE,
            `${baseVector.symbol}<sub>${symbolXString}</sub>` );

          // Y Component
          rightNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.yComponentProperty,
            COMPONENT_RANGE,
            `${baseVector.symbol}<sub>${symbolYString}</sub>` );
        }
        else {

          // Magnitude
          leftNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.magnitudeProperty,
            MAGNITUDE_RANGE,
            `${baseVector.symbol}`, {
              includeAbsoluteValueBars: true
            } );

          // Angle
          rightNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.angleDegreesProperty,
            ANGLE_RANGE,
            `${MathSymbols.THETA}<sub>${baseVector.symbol}</sub>`, {
              numberPickerOptions: { // increment by the polar Angle interval
                upFunction: value => { return value + POLAR_ANGLE_INTERVAL; },
                downFunction: value => { return value - POLAR_ANGLE_INTERVAL; }
              }
            } );
        }

        // Displayed Horizontally, push a HBox to the content children array
        accordionBoxContentChildren.push( new HBox( {
          spacing: options.numberPickerWithLabelsSpacing,
          children: [ leftNumberPickerAndLabel, rightNumberPickerAndLabel ]
        } ) );
      } );


      //----------------------------------------------------------------------------------------
      // Create the 'Show Base Vectors' checkbox that toggles the visibility of Base Vectors

      const showBaseVectorsText = new Text( showBaseVectorsString, {
        font: PANEL_FONT,
        maxWidth: contentWidth - CHECKBOX_OPTIONS.boxWidth - CHECKBOX_OPTIONS.spacing
      } );

      const baseVectorsCheckbox = new Checkbox( showBaseVectorsText, baseVectorsVisibleProperty, CHECKBOX_OPTIONS );

      accordionBoxContentChildren.push( baseVectorsCheckbox );

      //----------------------------------------------------------------------------------------
      // Create the accordion box

      const accordionBoxContent = new VBox( {
        children: accordionBoxContentChildren,
        spacing: options.contentSpacing
      } );

      super( new Node().setChildren( [
        accordionBoxContent,
        new HStrut( contentWidth, { pickable: false, center: accordionBoxContent.center } ) // Add a 'min' width
      ] ), options );
    }
  }


  //========================================================================================
  // Helper functions
  //========================================================================================

  /**
   * Layouts a Vector Symbol Node, a equals sign (Text), and a Number Picker horizontally in a HBox.
   *
   * The VectorSymbolNode is then aligned in a AlignBox to ensure the correct alignment and sizing, which ensures that
   * all HBoxes have equal widths (since the NumberPicker and the equals sign Text don't change size).
   *
   * @param {NumberProperty} numberProperty - number Property that goes in the Number Picker
   * @param {Range} numberRange - static numberRange of the number Property
   * @param {string} vectorSymbol - symbol passed to the Vector Symbol Node
   * @param {Object} [options]
   * @returns {HBox}
   */
  function createNumberPickerWithLabel( numberProperty, numberRange, vectorSymbol, options ) {

    options = merge( {

      numberPickerOptions: _.clone( VectorAdditionConstants.NUMBER_PICKER_OPTIONS ), // {Object} for NumberPicker

      vectorSymbolNodeOptions: { // {Object} passed to the Vector Symbol Node
        useRichText: true,  // Use rich text to support sub scripts
        richTextFont: new MathSymbolFont( { size: 19, weight: 600 } ),
        spacing: 1
      },
      vectorSymbolNodeWidth: 20, // {number} fixed width of the Vector Symbol Node
      includeAbsoluteValueBars: false, // {boolean} indicates if the Vector Symbol should have absolute value bars

      equalsSignFont: new PhetFont( { size: 15, weight: 400 } ),  // {Font} font for the equals sign text
      equalsSignMargin: 3 // {number} left and right margin of the equals sign

    }, options );

    const vectorSymbolNode = new VectorSymbolNode( vectorSymbol,
      null, // Should never have a 'coefficient'
      options.includeAbsoluteValueBars,
      options.vectorSymbolNodeOptions );

    const equalsSign = new Text( MathSymbols.EQUAL_TO, { font: options.equalsSignFont } );

    const numberPicker = new NumberPicker( numberProperty, new Property( numberRange ), options.numberPickerOptions );

    // Align the VectorSymbolNode in a AlignBox to ensure the correct alignment and sizing, which ensures that
    // all HBoxes have equal widths (since the NumberPicker and the equals sign Text don't change size).
    const alignedVectorSymbolNode = new AlignBox( vectorSymbolNode, {
      alignBounds: new Bounds2( 0, 0, options.vectorSymbolNodeWidth, vectorSymbolNode.height ),
      maxWidth: options.vectorSymbolNodeWidth
    } );
    vectorSymbolNode.maxWidth = options.vectorSymbolNodeWidth;

    return new HBox( {
      spacing: options.equalsSignMargin,
      children: [ alignedVectorSymbolNode, equalsSign, numberPicker ]
    } );
  }

  return vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );
} );