// Copyright 2025-2026, University of Colorado Boulder

/**
 * VectorValuesAccessibleParagraphProperty is the accessible paragraph that describes the vector that is
 * currently selected in the 'Vector Values' accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { isTReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import BaseVector from '../../equations/model/BaseVector.js';
import EquationsVector from '../../equations/model/EquationsVector.js';
import VectorAdditionFluent from '../../VectorAdditionFluent.js';
import Vector from '../model/Vector.js';
import VectorAdditionPreferences from '../model/VectorAdditionPreferences.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export class VectorValuesAccessibleParagraphProperty extends DerivedStringProperty<string,
  IntentionalAny, IntentionalAny, IntentionalAny, IntentionalAny, IntentionalAny,
  IntentionalAny, IntentionalAny, IntentionalAny, IntentionalAny, IntentionalAny,
  IntentionalAny, IntentionalAny, IntentionalAny, IntentionalAny, IntentionalAny> {

  public constructor( vector: Vector ) {

    // DerivedProperties shared by all descriptions.
    const magnitudeProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      () => toFixed( vector.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );

    const directionProperty = new DerivedProperty(
      [ vector.xyComponentsProperty, VectorAdditionPreferences.instance.angleConventionProperty ],
      ( xyComponents, angleConvention ) =>
        toFixed( vector.getAngleDegrees( angleConvention ) || 0, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES )
    );

    const xComponentProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      xyComponents => toFixed( xyComponents.x, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );

    const yComponentProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      xyComponents => toFixed( xyComponents.y, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );

    let fluentPattern: IntentionalAny;
    let fluentArgs: IntentionalAny;
    if ( vector instanceof BaseVector ) {

      // A base vector in the Equation screen.
      fluentPattern = VectorAdditionFluent.a11y.vectorValuesAccordionBox.accessibleParagraphBaseVector;
      fluentArgs = {
        symbol: vector.accessibleSymbolProperty,
        magnitude: magnitudeProperty,
        direction: directionProperty,
        xComponent: xComponentProperty,
        yComponent: yComponentProperty
      };
    }
    else if ( vector instanceof EquationsVector ) {

      // A vector that has a coefficient in the Equations screen.
      fluentPattern = VectorAdditionFluent.a11y.vectorValuesAccordionBox.accessibleParagraphCoefficientVector;
      fluentArgs = {
        coefficient: vector.coefficientProperty,
        symbol: vector.baseVector.accessibleSymbolProperty,
        magnitude: magnitudeProperty,
        direction: directionProperty,
        xComponent: xComponentProperty,
        yComponent: yComponentProperty
      };
    }
    else {

      // Any other vector.
      fluentPattern = VectorAdditionFluent.a11y.vectorValuesAccordionBox.accessibleParagraph;
      fluentArgs = {
        symbol: vector.accessibleSymbolProperty,
        magnitude: magnitudeProperty,
        direction: directionProperty,
        xComponent: xComponentProperty,
        yComponent: yComponentProperty
      };
    }

    super(
      _.uniq( [ ...fluentPattern.getDependentProperties(), ...Object.values( fluentArgs ).filter( isTReadOnlyProperty ) ] ) as IntentionalAny,
      () => fluentPattern.format( fluentArgs )
    );

    this.disposeEmitter.addListener( () => {
      magnitudeProperty.dispose();
      directionProperty.dispose();
      xComponentProperty.dispose();
      yComponentProperty.dispose();
    } );
  }
}
