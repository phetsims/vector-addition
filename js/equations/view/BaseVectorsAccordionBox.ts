// Copyright 2019-2024, University of Colorado Boulder

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

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox, HStrut, Node, NodeTranslationOptions, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import BaseVectorsCheckbox from './BaseVectorsCheckbox.js';
import { combineOptions, EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

// constants
const LABEL_MAX_WIDTH = 30; // maxWidth for picker labels, determined empirically
const X_SPACING = 11; // horizontal spacing between the left NumberPicker and the right label
const Y_SPACING = 17; // vertical spacing between UI components
const CONTENT_WIDTH = VectorAdditionConstants.BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH; // fixed content width

type SelfOptions = EmptySelfOptions;

type BaseVectorsAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<AccordionBoxOptions, 'expandedProperty'>;

export default class BaseVectorsAccordionBox extends AccordionBox {

  public constructor( baseVectorsVisibleProperty: Property<boolean>,
                      coordinateSnapMode: CoordinateSnapModes,
                      vectorSet: EquationsVectorSet,
                      providedOptions: BaseVectorsAccordionBoxOptions ) {

    const options = optionize4<BaseVectorsAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBoxOptions
        titleNode: new Text( VectorAdditionStrings.baseVectorsStringProperty, {
          font: VectorAdditionConstants.TITLE_FONT,
          maxWidth: 0.75 * CONTENT_WIDTH
        } ),
        isDisposable: false
      }, providedOptions );

    //----------------------------------------------------------------------------------------
    // Create the Number Pickers / labels
    //
    // Each Vector in the vectorSet gets 2 NumberPickers displayed horizontally. Each NumberPicker has
    // a 'label'.
    //
    // On Cartesian, the two NumberPickers toggle the X and the Y component respectively.
    // On Polar, the two NumberPickers toggle the magnitude and the angle respectively.
    //----------------------------------------------------------------------------------------

    const pickers: Node[] = []; // pairs of pickers and their labels

    // Each Vector in the vectorSet gets 2 NumberPickers, so loop through the vectorSet
    vectorSet.equationsVectors.forEach( vector => {

      const baseVector = vector.baseVector; // convenience reference

      // Empty references to the 2 NumberPickers/labels per Vector. To be set later.
      let leftNumberPickerAndLabel;
      let rightNumberPickerAndLabel;

      if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

        const cartesianBaseVector = baseVector as CartesianBaseVector;
        assert && assert( cartesianBaseVector instanceof CartesianBaseVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

        // X Component
        const leftLabel = baseVector.symbolProperty ?
                          new DerivedStringProperty( [ baseVector.symbolProperty, VectorAdditionSymbols.xStringProperty ],
                            ( baseVectorSymbol, xString ) => `${baseVectorSymbol}<sub>${xString}</sub>` ) :
                          null;
        leftNumberPickerAndLabel = createNumberPickerWithLabel(
          cartesianBaseVector.xComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: leftLabel,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ) );

        // Y Component
        const rightLabel = baseVector.symbolProperty ?
                           new DerivedStringProperty( [ baseVector.symbolProperty, VectorAdditionSymbols.yStringProperty ],
                             ( baseVectorSymbol, yString ) => `${baseVectorSymbol}<sub>${yString}</sub>` ) :
                           null;
        rightNumberPickerAndLabel = createNumberPickerWithLabel(
          cartesianBaseVector.yComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: rightLabel,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ) );
      }
      else {
        const polarBaseVector = baseVector as PolarBaseVector;
        assert && assert( polarBaseVector instanceof PolarBaseVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

        // Magnitude
        leftNumberPickerAndLabel = createNumberPickerWithLabel(
          polarBaseVector.magnitudeProperty,
          VectorAdditionConstants.MAGNITUDE_RANGE,
          new VectorSymbolNode( {
            symbolProperty: baseVector.symbolProperty,
            includeAbsoluteValueBars: true,
            maxWidth: LABEL_MAX_WIDTH
          } ) );

        // Angle
        assert && assert( baseVector.symbolProperty );
        const rightLabelProperty = new DerivedStringProperty( [ baseVector.symbolProperty! ],
          baseVectorSymbol => `${MathSymbols.THETA}<sub>${baseVectorSymbol}</sub>` );
        rightNumberPickerAndLabel = createNumberPickerWithLabel(
          polarBaseVector.angleDegreesProperty,
          VectorAdditionConstants.ANGLE_RANGE,
          new RichText( rightLabelProperty, {
            font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            // increment by the polar angle interval
            incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
            decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL
          } );
      }

      // Displayed Horizontally, push a HBox to the content children array
      pickers.push( new HBox( {
        align: 'origin',
        spacing: X_SPACING,
        children: [ leftNumberPickerAndLabel, rightNumberPickerAndLabel ]
      } ) );
    } );

    const pickersVBox = new VBox( {
      children: pickers,
      spacing: Y_SPACING,
      align: 'center'
    } );

    // Ensure that the accordion box is a fixed width.
    const strut = new HStrut( CONTENT_WIDTH, {
      pickable: false,
      center: pickersVBox.center
    } );
    const fixedWidthPickers = new Node( { children: [ strut, pickersVBox ] } );

    // Create the checkbox that toggles the visibility of Base Vectors
    const baseVectorsCheckbox = new BaseVectorsCheckbox( baseVectorsVisibleProperty, vectorSet.vectorColorPalette );

    const accordionBoxContent = new VBox( {
      children: [ fixedWidthPickers, baseVectorsCheckbox ],
      spacing: Y_SPACING,
      align: 'left',
      maxWidth: CONTENT_WIDTH
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
}

/**
 * Handles the layout of a label (Node), an equals sign (Text), and a NumberPicker, horizontally in an HBox.
 *
 * @param numberProperty - number Property that goes in the NumberPicker
 * @param numberRange - static numberRange of the number Property
 * @param labelNode
 * @param [numberPickerOptions]
 */
function createNumberPickerWithLabel( numberProperty: NumberProperty, numberRange: Range, labelNode: Node,
                                      numberPickerOptions?: NumberPickerOptions ): Node {

  const equalsSign = new Text( MathSymbols.EQUAL_TO, {
    font: VectorAdditionConstants.EQUATION_FONT
  } );

  // Empirically set the vertical position of the NumberPicker, and wrap it in a Node to work with HBox.
  // See https://github.com/phetsims/vector-addition/issues/209
  const numberPicker = new NumberPicker( numberProperty, new Property( numberRange ),
    combineOptions<NumberPickerOptions>( {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {
      touchAreaXDilation: 20,
      touchAreaYDilation: 10
    }, numberPickerOptions )
  );
  numberPicker.centerY = -equalsSign.height / 3;
  const numberPickerParent = new Node( { children: [ numberPicker ] } );

  return new HBox( {
    align: 'origin',
    spacing: 3, // space around the equals sign
    children: [ labelNode, equalsSign, numberPickerParent ]
  } );
}

vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );