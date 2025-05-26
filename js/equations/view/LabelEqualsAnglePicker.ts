// Copyright 2025, University of Colorado Boulder

/**
 * LabelEqualsAnglePicker implements the UI for setting an angle in the Base Vectors accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { signedToUnsignedDegrees, unsignedToSignedDegrees } from '../../common/VAUtils.js';
import Property from '../../../../axon/js/Property.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { LabelEqualsNumberPicker } from './LabelEqualsNumberPicker.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionPreferences from '../../common/model/VectorAdditionPreferences.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class LabelEqualsAnglePicker extends Node {

  public constructor( signedAngleDegreesProperty: Property<number>,
                      vectorSymbolProperty: TReadOnlyProperty<string>,
                      labelMaxWidth: number,
                      tandem: Tandem ) {

    const angleSymbolStringProperty = new DerivedStringProperty( [ vectorSymbolProperty ],
      baseVectorSymbol => `${MathSymbols.THETA}<sub>${baseVectorSymbol}</sub>` );

    const unsignedAngleDegreesProperty = new NumberProperty( signedToUnsignedDegrees( signedAngleDegreesProperty.value ), {
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

    // Signed [-180,180]
    const signedAngleLabeledPicker = new LabelEqualsNumberPicker(
      signedAngleDegreesProperty,
      VectorAdditionConstants.SIGNED_ANGLE_RANGE,
      new RichText( angleSymbolStringProperty, {
        font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
        maxWidth: labelMaxWidth
      } ), {
        // increment by the polar angle interval
        incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
        decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
        formatValue: angle => `${angle}${MathSymbols.DEGREES}`,
        phetioVisiblePropertyInstrumented: false,
        phetioEnabledPropertyInstrumented: false,
        tandem: Tandem.OPT_OUT
      } );

    // Unsigned [0,360]
    const unsignedAngleLabeledPicker = new LabelEqualsNumberPicker(
      unsignedAngleDegreesProperty,
      VectorAdditionConstants.UNSIGNED_ANGLE_RANGE,
      new RichText( angleSymbolStringProperty, {
        font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
        maxWidth: labelMaxWidth
      } ), {
        // increment by the polar angle interval
        incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
        decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
        formatValue: angle => `${angle}${MathSymbols.DEGREES}`,
        phetioVisiblePropertyInstrumented: false,
        phetioEnabledPropertyInstrumented: false,
        tandem: Tandem.OPT_OUT
      } );

    super( {
      children: [ signedAngleLabeledPicker, unsignedAngleLabeledPicker ],
      enabledProperty: new BooleanProperty( true, {
        tandem: tandem.createTandem( 'enabledProperty' ),
        phetioFeatured: true
      } ),
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    this.addLinkedElement( signedAngleDegreesProperty, {
      tandemName: 'valueProperty'
    } );

    this.enabledProperty.link( enabled => {
      signedAngleLabeledPicker.numberPicker.enabled = enabled;
      unsignedAngleLabeledPicker.numberPicker.enabled = enabled;
    } );

    VectorAdditionPreferences.instance.angleConventionProperty.link( angleConvention => {
      signedAngleLabeledPicker.visible = ( angleConvention === 'signed' );
      unsignedAngleLabeledPicker.visible = ( angleConvention === 'unsigned' );
    } );
  }
}

vectorAddition.register( 'LabelEqualsAnglePicker', LabelEqualsAnglePicker );