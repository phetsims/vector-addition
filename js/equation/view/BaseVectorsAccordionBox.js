// Copyright 2019, University of Colorado Boulder

/**
 * BaseVectorsAccordionBox appears on the right side of the 'Equation' screen. It contains pickers for modifying the
 * base vectors, and a checkbox to show/hide the base vectors.
 *
 * 'Is a' relationship with AccordionBox but adds the following functionality:
 *  - allow users to change the components of the Vectors on Cartesian mode (via numberPicker)
 *  - allow users to change the angle and the magnitude of the Vectors on polar mode (via numberPicker)
 *  - allow users to toggle the visibility of the Base Vectors (via checkbox)
 *
 * This AccordionBox is not meant to be disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BaseVectorsCheckbox = require( 'VECTOR_ADDITION/equation/view/BaseVectorsCheckbox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Property = require( 'AXON/Property' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // strings
  const baseVectorsString = require( 'string!VECTOR_ADDITION/baseVectors' );
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );

  // constants
  const LABEL_MAX_WIDTH = 30; // maxWidth for picker labels, determined empirically

  class BaseVectorsAccordionBox extends AccordionBox {

    /**
     * @param {BooleanProperty} baseVectorsVisibleProperty
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @param {EquationVectorSet} equationVectorSet
     * @param {Object} [options]
     */
    constructor( baseVectorsVisibleProperty, coordinateSnapMode, equationVectorSet, options ) {

      assert && assert( baseVectorsVisibleProperty instanceof BooleanProperty, `invalid baseVectorsVisibleProperty: ${baseVectorsVisibleProperty}` );
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( equationVectorSet instanceof EquationVectorSet, `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // specific to this class
        xSpacing: 11, // {number} spacing between the left Number Picker and the right label
        ySpacing: 15, // {number} y spacing between UI components
        contentWidth: VectorAdditionConstants.BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH, // fixed content width

        // super class options
        titleNode: new Text( baseVectorsString, { font: VectorAdditionConstants.TITLE_FONT } )

      }, options );


      // Assign a max width of the title node.
      options.titleNode.maxWidth = 0.75 * options.contentWidth;

      //----------------------------------------------------------------------------------------
      // Create the Number Pickers / labels
      //
      // Each Vector in the equationVectorSet gets 2 Number Pickers displayed horizontally. Each Number Picker has
      // a 'label'.
      //
      // On Cartesian, the two Number Pickers toggle the X and the Y component respectively.
      // On Polar, the two Number Pickers toggle the magnitude and the angle respectively.
      //----------------------------------------------------------------------------------------

      const pickers = []; // {HBox[]} pairs of pickers and their labels

      // Each Vector in the equationVectorSet gets 2 NumberPickers, so loop through the equationVectorSet
      equationVectorSet.vectors.forEach( equationVector => {

        const baseVector = equationVector.baseVector; // convenience reference

        // Empty references to the 2 NumberPickers/labels per Vector. To be set later.
        let leftNumberPickerAndLabel;
        let rightNumberPickerAndLabel;

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

          // X Component
          leftNumberPickerAndLabel = createNumberPickerWithLabel(
            baseVector.xComponentProperty,
            VectorAdditionConstants.COMPONENT_RANGE,
            new VectorSymbolNode( {
              symbol: `${baseVector.symbol}<sub>${symbolXString}</sub>`,
              showVectorArrow: false,
              maxWidth: LABEL_MAX_WIDTH
            } ) );

          // Y Component
          rightNumberPickerAndLabel = createNumberPickerWithLabel(
            baseVector.yComponentProperty,
            VectorAdditionConstants.COMPONENT_RANGE,
            new VectorSymbolNode( {
              symbol: `${baseVector.symbol}<sub>${symbolYString}</sub>`,
              showVectorArrow: false,
              maxWidth: LABEL_MAX_WIDTH
            } ) );
        }
        else {

          // Magnitude
          leftNumberPickerAndLabel = createNumberPickerWithLabel(
            baseVector.magnitudeProperty,
            VectorAdditionConstants.MAGNITUDE_RANGE,
            new VectorSymbolNode( {
              symbol: baseVector.symbol,
              includeAbsoluteValueBars: true,
              maxWidth: LABEL_MAX_WIDTH
            } ) );

          // Angle
          rightNumberPickerAndLabel = createNumberPickerWithLabel(
            baseVector.angleDegreesProperty,
            VectorAdditionConstants.ANGLE_RANGE,
            new RichText( `${MathSymbols.THETA}<sub>${baseVector.symbol}</sub>`, {
              font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
              maxWidth: LABEL_MAX_WIDTH
            } ), {
              numberPickerOptions: { // increment by the polar Angle interval
                upFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
                downFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL
              }
            } );
        }

        // Displayed Horizontally, push a HBox to the content children array
        pickers.push( new HBox( {
          spacing: options.xSpacing,
          children: [ leftNumberPickerAndLabel, rightNumberPickerAndLabel ]
        } ) );
      } );
      
      const pickersVBox = new VBox( {
        children: pickers,
        spacing: options.ySpacing,
        align: 'center'
      } );

      // Ensure that the accordion box is a fixed width.
      const strut = new HStrut( options.contentWidth, {
        pickable: false,
        center: pickersVBox.center
      } );
      const fixedWidthPickers = new Node( { children: [ strut, pickersVBox ] } );

      // Create the checkbox that toggles the visibility of Base Vectors
      const baseVectorsCheckbox = new BaseVectorsCheckbox( baseVectorsVisibleProperty, equationVectorSet.vectorColorPalette );

      const accordionBoxContent = new VBox( {
        children: [ fixedWidthPickers, baseVectorsCheckbox ],
        spacing: options.ySpacing,
        align: 'left',
        maxWidth: options.contentWidth
      } );

      super( accordionBoxContent, options );
    }
  }

  /**
   * Layouts a Vector Symbol Node, a equals sign (Text), and a Number Picker horizontally in a HBox.
   *
   * The VectorSymbolNode is then aligned in a AlignBox to ensure the correct alignment and sizing, which ensures that
   * all HBoxes have equal widths (since the NumberPicker and the equals sign Text don't change size).
   *
   * @param {NumberProperty} numberProperty - number Property that goes in the Number Picker
   * @param {Range} numberRange - static numberRange of the number Property
   * @param {Node} vectorSymbolNode
   * @param {Object} [options]
   * @returns {HBox}
   */
  function createNumberPickerWithLabel( numberProperty, numberRange, vectorSymbolNode, options ) {

    options = merge( {

      // {Object} options passed to NumberPicker
      numberPickerOptions: _.clone( VectorAdditionConstants.NUMBER_PICKER_OPTIONS ),

      equalsSignFont: VectorAdditionConstants.EQUATION_FONT,  // {Font} font for the equals sign text
      spacing: 3 // {number} space around the equals sign

    }, options );

    const equalsSign = new Text( MathSymbols.EQUAL_TO, { font: options.equalsSignFont } );

    const numberPicker = new NumberPicker( numberProperty, new Property( numberRange ), options.numberPickerOptions );

    return new HBox( {
      children: [ vectorSymbolNode, equalsSign, numberPicker ],
      spacing: options.spacing
    } );
  }

  return vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );
} );