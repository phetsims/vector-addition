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
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import VectorSymbolNode from '../../common/view/VectorSymbolNode.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import BaseVectorsCheckbox from './BaseVectorsCheckbox.js';
import { LabelEqualsNumberPicker } from './LabelEqualsNumberPicker.js';
import LabelEqualsAnglePicker from './LabelEqualsAnglePicker.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import BaseVector from '../../common/model/BaseVector.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const LABEL_MAX_WIDTH = 30; // maxWidth for picker labels, determined empirically
const X_SPACING = 11; // horizontal spacing between the left NumberPicker and the right label
const Y_SPACING = 8; // vertical spacing between UI components
const CONTENT_WIDTH = VectorAdditionConstants.BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH; // fixed content width

type SelfOptions = EmptySelfOptions;

type BaseVectorsAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class BaseVectorsAccordionBox extends AccordionBox {

  public constructor( baseVectors: BaseVector[],
                      coordinateSnapMode: CoordinateSnapMode,
                      vectorColorPalette: VectorColorPalette,
                      baseVectorsVisibleProperty: Property<boolean>,
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

    // Each base vector gets 2 NumberPickers.
    baseVectors.forEach( baseVector => {

      if ( coordinateSnapMode === 'cartesian' ) {

        const cartesianBaseVector = baseVector as CartesianBaseVector;
        affirm( cartesianBaseVector instanceof CartesianBaseVector, 'Expected instance of CartesianBaseVector.' );

        // x-component
        const xSymbolStringProperty = new DerivedStringProperty(
          [ cartesianBaseVector.symbolProperty, VectorAdditionSymbols.xStringProperty ],
          ( baseVectorSymbol, xString ) => `${baseVectorSymbol}<sub>${xString}</sub>` );
        const xLabeledPicker = new LabelEqualsNumberPicker(
          cartesianBaseVector.xComponentProperty,
          VectorAdditionConstants.XY_COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: xSymbolStringProperty,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorXComponentPicker.accessibleNameStringProperty, {
              symbol: cartesianBaseVector.accessibleSymbolProperty
            } ),
            accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorXComponentPicker.accessibleHelpTextStringProperty, {
              symbol: cartesianBaseVector.accessibleSymbolProperty
            } ),
            tandem: pickersTandem.createTandem( `${baseVector.tandemNameSymbol}xPicker` )
          } );

        // y-component
        const ySymbolStringProperty = new DerivedStringProperty(
          [ cartesianBaseVector.symbolProperty, VectorAdditionSymbols.yStringProperty ],
          ( baseVectorSymbol, yString ) => `${baseVectorSymbol}<sub>${yString}</sub>` );
        const yLabeledPicker = new LabelEqualsNumberPicker(
          cartesianBaseVector.yComponentProperty,
          VectorAdditionConstants.XY_COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: ySymbolStringProperty,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorYComponentPicker.accessibleNameStringProperty, {
              symbol: cartesianBaseVector.accessibleSymbolProperty
            } ),
            accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorYComponentPicker.accessibleHelpTextStringProperty, {
              symbol: cartesianBaseVector.accessibleSymbolProperty
            } ),
            tandem: pickersTandem.createTandem( `${baseVector.tandemNameSymbol}yPicker` )
          } );

        rows.push( new HBox( {
          align: 'origin',
          spacing: X_SPACING,
          children: [ xLabeledPicker, yLabeledPicker ],

          // For PhET-iO, keep the layout from changing when pickers are hidden.
          excludeInvisibleChildrenFromBounds: false,

          // For PhET-iO, hide the entire HBox if both pickers are hidden.
          visibleProperty: DerivedProperty.or( [ xLabeledPicker.visibleProperty, yLabeledPicker.visibleProperty ] )
        } ) );
      }
      else {
        const polarBaseVector = baseVector as PolarBaseVector;
        affirm( polarBaseVector instanceof PolarBaseVector, 'Expected instance of PolarBaseVector.' );

        // Magnitude
        const magnitudeLabeledPicker = new LabelEqualsNumberPicker(
          polarBaseVector.magnitudeProperty,
          VectorAdditionConstants.MAGNITUDE_RANGE,
          new VectorSymbolNode( {
            symbolProperty: polarBaseVector.symbolProperty,
            includeAbsoluteValueBars: true,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorMagnitudePicker.accessibleNameStringProperty, {
              symbol: polarBaseVector.accessibleSymbolProperty
            } ),
            accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorMagnitudePicker.accessibleHelpTextStringProperty, {
              symbol: polarBaseVector.accessibleSymbolProperty
            } ),
            tandem: pickersTandem.createTandem( `${baseVector.tandemNameSymbol}MagnitudePicker` )
          } );

        // Angle
        const anglePicker = new LabelEqualsAnglePicker( polarBaseVector.angleProperty, polarBaseVector.symbolProperty,
          polarBaseVector.accessibleSymbolProperty, LABEL_MAX_WIDTH, pickersTandem.createTandem( `${baseVector.tandemNameSymbol}AnglePicker` ) );

        rows.push( new HBox( {
          align: 'origin',
          spacing: X_SPACING,
          children: [ magnitudeLabeledPicker, anglePicker ],

          // For PhET-iO, keep the layout from changing when pickers are hidden.
          excludeInvisibleChildrenFromBounds: false,

          // For PhET-iO, hide the entire HBox if both pickers are hidden.
          visibleProperty: DerivedProperty.or( [ magnitudeLabeledPicker.visibleProperty, anglePicker.visibleProperty ] )
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
    const baseVectorsCheckbox = new BaseVectorsCheckbox( baseVectorsVisibleProperty, vectorColorPalette,
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

    // When the accordion box is expanded or collapsed, cancel interactions.
    this.expandedProperty.lazyLink( () => this.interruptSubtreeInput() );
  }
}

vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );