// Copyright 2025, University of Colorado Boulder

/**
 * LabelEqualsAnglePicker implements the UI for setting an angle in the Base Vectors accordion box.
 *
 * This is more complicated than NumberPickers for other vector quantities because we must support the 'Angle Convention'
 * preference. Attempting to support that with a single NumberPicker was complicated and buggy, because the NumberPicker's
 * Property and range would have to map between signed and unsigned values, and because the mapping between signed
 * and unsigned ranges is not straightforward.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { signedToUnsignedDegrees, unsignedToSignedDegrees } from '../../common/VectorAdditionUtils.js';
import Property from '../../../../axon/js/Property.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { LabelEqualsNumberPicker } from './LabelEqualsNumberPicker.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionPreferences from '../../common/model/VectorAdditionPreferences.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class LabelEqualsAnglePicker extends Node {

  public constructor( signedAngleDegreesProperty: Property<number>,
                      vectorSymbolProperty: TReadOnlyProperty<string>,
                      vectorAccessibleSymbolProperty: TReadOnlyProperty<string>,
                      labelMaxWidth: number,
                      tandem: Tandem ) {

    const angleSymbolStringProperty = new DerivedStringProperty( [ vectorSymbolProperty ],
      baseVectorSymbol => `${VectorAdditionSymbols.THETA}<sub>${baseVectorSymbol}</sub>` );

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

        // No need to localize this string. The degree symbol is universally recognized, especially in STEM contexts.
        formatValue: angle => `${angle}${MathSymbols.DEGREES}`,
        accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorAnglePicker.accessibleNameStringProperty, {
          symbol: vectorAccessibleSymbolProperty
        } ),
        accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorAnglePicker.accessibleHelpTextStringProperty, {
          symbol: vectorAccessibleSymbolProperty
        } ),
        tandem: Tandem.OPT_OUT // because the parent Node is instrumented and decides which LabelEqualsNumberPicker is visible.
      } );

    // Unsigned [0,360]
    const unsignedAngleLabeledPicker = new LabelEqualsNumberPicker(
      unsignedAngleDegreesProperty,

      // 0 and 360 are the same value, and signedToUnsignedDegrees maps both to 0. Since that is done throughout the
      // UI, we must limit the range.max here to 355.  It would be nicer if NumberPicker could wrap around between
      // 0 and 355, but that is not directly supported, and attempts to make it work were buggy, brittle, and too clever.
      new Range( 0, 360 - VectorAdditionConstants.POLAR_ANGLE_INTERVAL ),
      new RichText( angleSymbolStringProperty, {
        font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
        maxWidth: labelMaxWidth
      } ), {
        // increment by the polar angle interval
        incrementFunction: value => value + VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
        decrementFunction: value => value - VectorAdditionConstants.POLAR_ANGLE_INTERVAL,

        // No need to localize this string. The degree symbol is universally recognized, especially in STEM contexts.
        formatValue: angle => `${angle}${MathSymbols.DEGREES}`,
        accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorAnglePicker.accessibleNameStringProperty, {
          symbol: vectorAccessibleSymbolProperty
        } ),
        accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorAnglePicker.accessibleHelpTextStringProperty, {
          symbol: vectorAccessibleSymbolProperty
        } ),
        tandem: Tandem.OPT_OUT // because the parent Node is instrumented and decides which LabelEqualsNumberPicker is visible.
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