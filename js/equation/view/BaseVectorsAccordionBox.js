// Copyright 2019, University of Colorado Boulder

/**
 * BaseVectorsAccordionBox appears on the right side of the 'Equation' screen. It contains pickers for modifying the
 * base vectors, and a checkbox to show/hide the base vectors.
 *
 * 'Is a' relationship with AccordionBox but adds the following functionality:
 *  - allow users to change the components of the Vectors on cartesian mode (via numberPicker)
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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  // strings
  const baseVectorsString = require( 'string!VECTOR_ADDITION/baseVectors' );
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );

  // constants
  // ranges for Number Pickers
  const COMPONENT_RANGE = new Range( -10, 10 );
  const MAGNITUDE_RANGE = new Range( -10, 10 );
  const ANGLE_RANGE = new Range( -180, 180 );

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

      options = _.extend( {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // specific to this class
        xSpacing: 11, // {number} spacing between the left Number Picker and the right label
        ySpacing: 15, // {number} y spacing between UI components
        fixedWidth: 190, // {number} fixed width of the Accordion Box

        // super class options
        titleNode: new Text( baseVectorsString, { font: VectorAdditionConstants.TITLE_FONT } )

      }, options );


      // Assign a max width of the title node. Calculated by taking the total width and subtracting everything that
      // isn't the title
      options.titleNode.maxWidth = options.fixedWidth       // total width
                                   - options.titleXMargin   // margin between the title right edge
                                   - options.titleXSpacing  // space between the title and the button
                                   - options.expandCollapseButtonOptions.sideLength // button size
                                   - options.buttonXMargin; // margin between the button and the left edge

      //----------------------------------------------------------------------------------------
      // Create the Number Pickers / labels
      //
      // Each Vector in the equationVectorSet gets 2 Number Pickers displayed horizontally. Each Number Picker has
      // a 'label'.
      //
      // On Cartesian, the two Number Pickers toggle the X and the Y component respectively.
      // On Polar, the two Number Pickers toggle the magnitude and the angle respectively.
      //----------------------------------------------------------------------------------------

      const pickers = []; // empty (for now) array of pairs of pickers and their labels

      // Each Vector in the equationVectorSet gets 2 NumberPickers, so loop through the equationVectorSet
      equationVectorSet.vectors.forEach( equationVector => {

        const baseVector = equationVector.baseVector; // convenience reference

        // Empty references to the 2 NumberPickers/labels per Vector. To be set later.
        let leftNumberPickerAndLabel;
        let rightNumberPickerAndLabel;

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

          // X Component
          leftNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.xComponentProperty, COMPONENT_RANGE,
            new VectorSymbolNode( {
              symbol: `${baseVector.symbol}<sub>${symbolXString}</sub>`,
              showVectorArrow: false
            } ) );

          // Y Component
          rightNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.yComponentProperty, COMPONENT_RANGE,
            new VectorSymbolNode( {
              symbol: `${baseVector.symbol}<sub>${symbolYString}</sub>`,
              showVectorArrow: false
            } ) );
        }
        else {

          // Magnitude
          leftNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.magnitudeProperty, MAGNITUDE_RANGE,
            new VectorSymbolNode( {
              symbol: baseVector.symbol,
              includeAbsoluteValueBars: true
            } ) );

          // Angle
          rightNumberPickerAndLabel = createNumberPickerWithLabel( baseVector.angleDegreesProperty, ANGLE_RANGE,
            new RichText( `${MathSymbols.THETA}<sub>${baseVector.symbol}</sub>`, {
              font: VectorAdditionConstants.EQUATION_SYMBOL_FONT
            } ), {
              numberPickerOptions: { // increment by the polar Angle interval
                upFunction: value => { return value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL; },
                downFunction: value => { return value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL; }
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
      const minWidth = options.fixedWidth - ( 2 * options.contentXMargin );
      const strut = new HStrut( minWidth, {
        pickable: false,
        center: pickersVBox.center
      } );
      const fixedWidthPickers = new Node( { children: [ strut, pickersVBox ] } );

      // Create the checkbox that toggles the visibility of Base Vectors
      const baseVectorsIcon = VectorAdditionIconFactory.createVectorIcon( {
        fill: equationVectorSet.vectorColorPalette.baseVectorFill,
        stroke: equationVectorSet.vectorColorPalette.baseVectorStroke,
        lineWidth: VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS.lineWidth,
        length: 50
      } );
      const baseVectorsCheckbox = new Checkbox( baseVectorsIcon, baseVectorsVisibleProperty,
        VectorAdditionConstants.CHECKBOX_OPTIONS );

      const accordionBoxContent = new VBox( {
        children: [ fixedWidthPickers, baseVectorsCheckbox ],
        spacing: options.ySpacing,
        align: 'left'
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