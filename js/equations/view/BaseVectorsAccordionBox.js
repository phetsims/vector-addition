// Copyright 2019-2023, University of Colorado Boulder

/**
 * BaseVectorsAccordionBox appears on the right side of the 'Equations' screen. It contains pickers for modifying the
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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox, HStrut, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import BaseVectorsCheckbox from './BaseVectorsCheckbox.js';

// constants
const LABEL_MAX_WIDTH = 30; // maxWidth for picker labels, determined empirically

export default class BaseVectorsAccordionBox extends AccordionBox {

  /**
   * @param {BooleanProperty} baseVectorsVisibleProperty
   * @param {CoordinateSnapModes} coordinateSnapMode
   * @param {EquationsVectorSet} vectorSet
   * @param {Object} [options]
   */
  constructor( baseVectorsVisibleProperty, coordinateSnapMode, vectorSet, options ) {

    assert && assert( baseVectorsVisibleProperty instanceof BooleanProperty, `invalid baseVectorsVisibleProperty: ${baseVectorsVisibleProperty}` );
    assert && assert( CoordinateSnapModes.enumeration.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
    assert && assert( vectorSet instanceof EquationsVectorSet, `invalid vectorSet: ${vectorSet}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    //----------------------------------------------------------------------------------------

    options = merge( {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

      // specific to this class
      xSpacing: 11, // {number} spacing between the left NumberPicker and the right label
      ySpacing: 17, // {number} y spacing between UI components
      contentWidth: VectorAdditionConstants.BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH, // fixed content width

      // super class options
      titleNode: new Text( VectorAdditionStrings.baseVectors, { font: VectorAdditionConstants.TITLE_FONT } )

    }, options );


    // Assign a max width of the title node.
    options.titleNode.maxWidth = 0.75 * options.contentWidth;

    //----------------------------------------------------------------------------------------
    // Create the Number Pickers / labels
    //
    // Each Vector in the vectorSet gets 2 NumberPickers displayed horizontally. Each NumberPicker has
    // a 'label'.
    //
    // On Cartesian, the two NumberPickers toggle the X and the Y component respectively.
    // On Polar, the two NumberPickers toggle the magnitude and the angle respectively.
    //----------------------------------------------------------------------------------------

    const pickers = []; // {HBox[]} pairs of pickers and their labels

    // Each Vector in the vectorSet gets 2 NumberPickers, so loop through the vectorSet
    vectorSet.vectors.forEach( vector => {

      const baseVector = vector.baseVector; // convenience reference

      // Empty references to the 2 NumberPickers/labels per Vector. To be set later.
      let leftNumberPickerAndLabel;
      let rightNumberPickerAndLabel;

      if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

        // X Component
        leftNumberPickerAndLabel = createNumberPickerWithLabel(
          baseVector.xComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbol: `${baseVector.symbol}<sub>${VectorAdditionStrings.symbol.x}</sub>`,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ) );

        // Y Component
        rightNumberPickerAndLabel = createNumberPickerWithLabel(
          baseVector.yComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbol: `${baseVector.symbol}<sub>${VectorAdditionStrings.symbol.y}</sub>`,
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
            numberPickerOptions: { // increment by the polar angle interval
              incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
              decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL
            }
          } );
      }

      // Displayed Horizontally, push a HBox to the content children array
      pickers.push( new HBox( {
        align: 'origin',
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
    const baseVectorsCheckbox = new BaseVectorsCheckbox( baseVectorsVisibleProperty, vectorSet.vectorColorPalette );

    const accordionBoxContent = new VBox( {
      children: [ fixedWidthPickers, baseVectorsCheckbox ],
      spacing: options.ySpacing,
      align: 'left',
      maxWidth: options.contentWidth
    } );

    super( accordionBoxContent, options );

    // When the box is collapsed, cancel interactions.
    // unlink is not necessary, exists for the lifetime of the sim.
    this.expandedProperty.lazyLink( expanded => {
      if ( !expanded ) {
        this.interruptSubtreeInput();
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'BaseVectorsAccordionBox is not intended to be disposed' );
  }
}

/**
 * Layouts a VectorSymbolNode, a equals sign (Text), and a NumberPicker horizontally in a HBox.
 *
 * The VectorSymbolNode is then aligned in a AlignBox to ensure the correct alignment and sizing, which ensures that
 * all HBoxes have equal widths (since the NumberPicker and the equals sign Text don't change size).
 *
 * @param {NumberProperty} numberProperty - number Property that goes in the NumberPicker
 * @param {Range} numberRange - static numberRange of the number Property
 * @param {Node} vectorSymbolNode
 * @param {Object} [options]
 * @returns {HBox}
 */
function createNumberPickerWithLabel( numberProperty, numberRange, vectorSymbolNode, options ) {

  options = merge( {

    // options passed to NumberPicker
    numberPickerOptions: merge( {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {
      touchAreaXDilation: 20,
      touchAreaYDilation: 10
    } ),

    equalsSignFont: VectorAdditionConstants.EQUATION_FONT,  // {Font} font for the equals sign text
    spacing: 3 // {number} space around the equals sign

  }, options );

  const equalsSign = new Text( MathSymbols.EQUAL_TO, { font: options.equalsSignFont } );

  // Empirically set the vertical position of the NumberPicker, and wrap it in a Node to work with HBox.
  // See https://github.com/phetsims/vector-addition/issues/209
  const numberPicker = new NumberPicker( numberProperty, new Property( numberRange ), options.numberPickerOptions );
  numberPicker.centerY = -equalsSign.height / 3;
  const numberPickerParent = new Node( { children: [ numberPicker ] } );

  return new HBox( {
    align: 'origin',
    spacing: options.spacing,
    children: [ vectorSymbolNode, equalsSign, numberPickerParent ]
  } );
}

vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );