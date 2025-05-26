// Copyright 2019-2025, University of Colorado Boulder

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

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions, EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import BaseVectorsCheckbox from './BaseVectorsCheckbox.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import VectorAdditionPreferences from '../../common/model/VectorAdditionPreferences.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { signedToUnsignedDegrees, unsignedToSignedDegrees } from '../../common/VAUtils.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const LABEL_MAX_WIDTH = 30; // maxWidth for picker labels, determined empirically
const X_SPACING = 11; // horizontal spacing between the left NumberPicker and the right label
const Y_SPACING = 8; // vertical spacing between UI components
const CONTENT_WIDTH = VectorAdditionConstants.BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH; // fixed content width

type SelfOptions = EmptySelfOptions;

type BaseVectorsAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class BaseVectorsAccordionBox extends AccordionBox {

  public constructor( baseVectorsVisibleProperty: Property<boolean>,
                      coordinateSnapMode: CoordinateSnapMode,
                      vectorSet: EquationsVectorSet,
                      providedOptions: BaseVectorsAccordionBoxOptions ) {

    const options = optionize4<BaseVectorsAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, VectorAdditionConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBoxOptions
        isDisposable: false,
        titleNode: new Text( VectorAdditionStrings.baseVectorsStringProperty, {
          font: VectorAdditionConstants.TITLE_FONT,
          maxWidth: 0.75 * CONTENT_WIDTH
        } )
      }, providedOptions );

    //----------------------------------------------------------------------------------------
    // Create the labeled NumberPickers.
    // Each Vector in the vectorSet gets two NumberPickers, labeled, and displayed horizontally.
    // For the Cartesian scene, the two NumberPickers set the vector's X and the Y components.
    // For the Polar scene, the two NumberPickers set the vector's magnitude and angle.
    //----------------------------------------------------------------------------------------

    const rows: HBox[] = []; // each row is two labeled NumberPickers

    const pickersTandem = options.tandem.createTandem( 'pickers' );

    // Each Vector in the vectorSet gets 2 NumberPickers, so loop through the vectorSet
    vectorSet.equationsVectors.forEach( vector => {

      const baseVector = vector.baseVector; // convenience reference

      //TODO https://github.com/phetsims/vector-addition/issues/258 Using baseVectorSymbol in tandem names will break the PhET-iO API, because baseVectorSymbol is localized.
      const baseVectorSymbol = baseVector.symbolProperty!.value;

      if ( coordinateSnapMode === 'cartesian' ) {

        const cartesianBaseVector = baseVector as CartesianBaseVector;
        assert && assert( cartesianBaseVector instanceof CartesianBaseVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

        // X Component
        const xSymbolStringProperty = baseVector.symbolProperty ?
                                      new DerivedStringProperty( [ baseVector.symbolProperty, VectorAdditionSymbols.xStringProperty ],
                                        ( baseVectorSymbol, xString ) => `${baseVectorSymbol}<sub>${xString}</sub>` ) :
                                      null;
        const xLabeledPicker = new LabeledNumberPicker(
          cartesianBaseVector.xComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: xSymbolStringProperty,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            tandem: pickersTandem.createTandem( `${baseVectorSymbol}xPicker` )
          } );

        // Y Component
        const ySymbolStringProperty = baseVector.symbolProperty ?
                                      new DerivedStringProperty( [ baseVector.symbolProperty, VectorAdditionSymbols.yStringProperty ],
                                        ( baseVectorSymbol, yString ) => `${baseVectorSymbol}<sub>${yString}</sub>` ) :
                                      null;
        const yLabeledPicker = new LabeledNumberPicker(
          cartesianBaseVector.yComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: ySymbolStringProperty,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            tandem: pickersTandem.createTandem( `${baseVectorSymbol}yPicker` )
          } );

        rows.push( new HBox( {
          align: 'origin',
          spacing: X_SPACING,
          children: [ xLabeledPicker, yLabeledPicker ]
        } ) );
      }
      else {
        const polarBaseVector = baseVector as PolarBaseVector;
        assert && assert( polarBaseVector instanceof PolarBaseVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

        // Magnitude
        const magnitudeLabeledPicker = new LabeledNumberPicker(
          polarBaseVector.magnitudeProperty,
          VectorAdditionConstants.MAGNITUDE_RANGE,
          new VectorSymbolNode( {
            symbolProperty: baseVector.symbolProperty,
            includeAbsoluteValueBars: true,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            tandem: pickersTandem.createTandem( `${baseVectorSymbol}MagnitudePicker` )
          } );

        // Angle - we need 2 NumberPickers, one for each angle convention (signed vs unsigned).
        assert && assert( baseVector.symbolProperty );
        const angleSymbolStringProperty = new DerivedStringProperty( [ baseVector.symbolProperty! ],
          baseVectorSymbol => `${MathSymbols.THETA}<sub>${baseVectorSymbol}</sub>` );

        const signedAngleDegreesProperty = polarBaseVector.angleDegreesProperty;
        const unsignedAngleDegreesProperty = new NumberProperty( signedToUnsignedDegrees( polarBaseVector.angleDegreesProperty.value ), {
          range: VectorAdditionConstants.UNSIGNED_ANGLE_RANGE
        } );

        // Keep the signed and unsigned angle Properties synchronized.
        let isSetting = false;
        signedAngleDegreesProperty.lazyLink( signedAngle => {
          if ( !isSetting ) {
            isSetting = true;
            unsignedAngleDegreesProperty.value = signedToUnsignedDegrees( signedAngle );
            isSetting = false;
          }
        } );
        unsignedAngleDegreesProperty.link( unsignedAngle => {
          if ( !isSetting ) {
            isSetting = true;
            signedAngleDegreesProperty.value = unsignedToSignedDegrees( unsignedAngle );
            isSetting = false;
          }
        } );

        const anglePickersTandem = pickersTandem.createTandem( `${baseVectorSymbol}AnglePickers` );

        // Signed [-180,180]
        const signedAngleLabeledPicker = new LabeledNumberPicker(
          polarBaseVector.angleDegreesProperty,
          VectorAdditionConstants.SIGNED_ANGLE_RANGE,
          new RichText( angleSymbolStringProperty, {
            font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            // increment by the polar angle interval
            incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
            decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
            formatValue: angle => `${angle}${MathSymbols.DEGREES}`,
            phetioVisiblePropertyInstrumented: false,
            phetioEnabledPropertyInstrumented: false,
            tandem: anglePickersTandem.createTandem( `${baseVectorSymbol}SignedAnglePicker` ),
            phetioDocumentation: 'Angle picker for the signed angle convention (-180° to 180°)'
          } );

        // Unsigned [0,360]
        const unsignedAngleLabeledPicker = new LabeledNumberPicker(
          unsignedAngleDegreesProperty,
          VectorAdditionConstants.UNSIGNED_ANGLE_RANGE,
          new RichText( angleSymbolStringProperty, {
            font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            // increment by the polar angle interval
            incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
            decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
            formatValue: angle => `${angle}${MathSymbols.DEGREES}`,
            phetioVisiblePropertyInstrumented: false,
            phetioEnabledPropertyInstrumented: false,
            tandem: anglePickersTandem.createTandem( `${baseVectorSymbol}UnsignedAnglePicker` ),
            phetioDocumentation: 'Angle picker for the unsigned angle convention (0° to 360°)'
          } );

        const anglePickers = new Node( {
          children: [ signedAngleLabeledPicker, unsignedAngleLabeledPicker ],
          enabledProperty: new BooleanProperty( true, {
            tandem: anglePickersTandem.createTandem( 'enabledProperty' ),
            phetioFeatured: true
          } ),
          tandem: anglePickersTandem,
          visiblePropertyOptions: {
            phetioFeatured: true
          }
        } );

        anglePickers.enabledProperty.link( enabled => {
          signedAngleLabeledPicker.numberPicker.enabled = enabled;
          unsignedAngleLabeledPicker.numberPicker.enabled = enabled;
        } );

        VectorAdditionPreferences.instance.angleConventionProperty.link( angleConvention => {
          signedAngleLabeledPicker.visible = ( angleConvention === 'signed' );
          unsignedAngleLabeledPicker.visible = ( angleConvention === 'unsigned' );
        } );

        rows.push( new HBox( {
          align: 'origin',
          spacing: X_SPACING,
          children: [ magnitudeLabeledPicker, anglePickers ]
        } ) );
      }
    } );

    const pickersVBox = new VBox( {
      children: rows,
      spacing: Y_SPACING,
      align: 'center',
      layoutOptions: {
        align: 'center'
      }
    } );

    // Checkbox that toggles the visibility of base vectors.
    const baseVectorsCheckbox = new BaseVectorsCheckbox( baseVectorsVisibleProperty, vectorSet.vectorColorPalette,
      options.tandem.createTandem( 'baseVectorsCheckbox' ) );

    // Ensure that the accordion box is a fixed width. This is an old-style pattern, not recommended.
    const strut = new HStrut( CONTENT_WIDTH, {
      pickable: false
    } );

    const content = new VBox( {
      children: [
        pickersVBox,
        strut,
        baseVectorsCheckbox
      ],
      spacing: Y_SPACING,
      align: 'left',
      maxWidth: CONTENT_WIDTH
    } );

    super( content, options );

    // When the box is collapsed, cancel interactions.
    this.expandedProperty.lazyLink( expanded => {
      if ( !expanded ) {
        this.interruptSubtreeInput();
      }
    } );
  }
}

/**
 * LabeledNumberPicker is a label (Node), equals sign (Text), and a NumberPicker, with horizontal layout.
 */
class LabeledNumberPicker extends HBox {

  public readonly numberPicker: NumberPicker;

  public constructor( numberProperty: Property<number>,
                      numberRange: Range,
                      labelNode: Node,
                      numberPickerOptions: WithRequired<NumberPickerOptions, 'tandem'> ) {

    const equalsSign = new Text( MathSymbols.EQUAL_TO, {
      font: VectorAdditionConstants.EQUATION_FONT
    } );

    // Empirically set the vertical position of the NumberPicker, and wrap it in a Node to work with HBox.
    // See https://github.com/phetsims/vector-addition/issues/209
    const numberPicker = new NumberPicker( numberProperty, new Property( numberRange ),
      combineOptions<NumberPickerOptions>( {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {
        touchAreaXDilation: 20,
        touchAreaYDilation: 10,

        // Hide arrows when picker is disabled.
        disabledOpacity: 1,
        backgroundStrokeDisabledOpacity: 1,
        arrowDisabledOpacity: 0
      }, numberPickerOptions )
    );
    numberPicker.centerY = -equalsSign.height / 3;
    const numberPickerParent = new Node( { children: [ numberPicker ] } );

    super( {
      align: 'origin',
      spacing: 3, // space around the equals sign
      children: [ labelNode, equalsSign, numberPickerParent ],
      visibleProperty: numberPicker.visibleProperty
    } );

    this.numberPicker = numberPicker;
  }
}

vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );