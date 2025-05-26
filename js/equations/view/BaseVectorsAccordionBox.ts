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
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import BaseVectorsCheckbox from './BaseVectorsCheckbox.js';
import { LabelEqualsNumberPicker } from './LabelEqualsNumberPicker.js';
import LabelEqualsAnglePicker from './LabelEqualsAnglePicker.js';

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

      //TODO https://github.com/phetsims/vector-addition/issues/258 Using baseVectorSymbol in tandem names will break the PhET-iO API, because baseVectorSymbol is localized.
      const vectorTandemPrefix = vector.baseVector.symbolProperty!.value;

      if ( coordinateSnapMode === 'cartesian' ) {

        const cartesianBaseVector = vector.baseVector as CartesianBaseVector;
        assert && assert( cartesianBaseVector instanceof CartesianBaseVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

        // X Component
        const xSymbolStringProperty = cartesianBaseVector.symbolProperty ?
                                      new DerivedStringProperty( [ cartesianBaseVector.symbolProperty, VectorAdditionSymbols.xStringProperty ],
                                        ( baseVectorSymbol, xString ) => `${baseVectorSymbol}<sub>${xString}</sub>` ) :
                                      null;
        const xLabeledPicker = new LabelEqualsNumberPicker(
          cartesianBaseVector.xComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: xSymbolStringProperty,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            tandem: pickersTandem.createTandem( `${vectorTandemPrefix}xPicker` )
          } );

        // Y Component
        const ySymbolStringProperty = cartesianBaseVector.symbolProperty ?
                                      new DerivedStringProperty( [ cartesianBaseVector.symbolProperty, VectorAdditionSymbols.yStringProperty ],
                                        ( baseVectorSymbol, yString ) => `${baseVectorSymbol}<sub>${yString}</sub>` ) :
                                      null;
        const yLabeledPicker = new LabelEqualsNumberPicker(
          cartesianBaseVector.yComponentProperty,
          VectorAdditionConstants.COMPONENT_RANGE,
          new VectorSymbolNode( {
            symbolProperty: ySymbolStringProperty,
            showVectorArrow: false,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            tandem: pickersTandem.createTandem( `${vectorTandemPrefix}yPicker` )
          } );

        rows.push( new HBox( {
          align: 'origin',
          spacing: X_SPACING,
          children: [ xLabeledPicker, yLabeledPicker ]
        } ) );
      }
      else {
        const polarBaseVector = vector.baseVector as PolarBaseVector;
        assert && assert( polarBaseVector instanceof PolarBaseVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

        // Magnitude
        const magnitudeLabeledPicker = new LabelEqualsNumberPicker(
          polarBaseVector.magnitudeProperty,
          VectorAdditionConstants.MAGNITUDE_RANGE,
          new VectorSymbolNode( {
            symbolProperty: polarBaseVector.symbolProperty,
            includeAbsoluteValueBars: true,
            maxWidth: LABEL_MAX_WIDTH
          } ), {
            tandem: pickersTandem.createTandem( `${vectorTandemPrefix}MagnitudePicker` )
          } );

        // Angle
        assert && assert( polarBaseVector.symbolProperty );
        const anglePicker = new LabelEqualsAnglePicker( polarBaseVector.angleDegreesProperty, polarBaseVector.symbolProperty!,
          LABEL_MAX_WIDTH, pickersTandem.createTandem( `${vectorTandemPrefix}AnglePicker` ) );

        rows.push( new HBox( {
          align: 'origin',
          spacing: X_SPACING,
          children: [ magnitudeLabeledPicker, anglePicker ]
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

vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );