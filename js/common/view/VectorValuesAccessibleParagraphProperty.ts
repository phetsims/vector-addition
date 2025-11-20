// Copyright 2025, University of Colorado Boulder

/**
 * VectorValuesAccessibleParagraphProperty is the accessible paragraph that describes the vector that is
 * currently selected in the 'Vector Values' accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import EquationsVector from '../../equations/model/EquationsVector.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import BaseVector from '../model/BaseVector.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export class VectorValuesAccessibleParagraphProperty extends PatternStringProperty<IntentionalAny> {

  public constructor( vector: Vector ) {

    // DerivedProperties shared by all descriptions.
    const magnitudeProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      () => toFixed( vector.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );
    const directionProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      () => toFixed( vector.getAngleDegrees() || 0, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );
    const xComponentProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      xyComponents => toFixed( xyComponents.x, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );
    const yComponentProperty = new DerivedProperty( [ vector.xyComponentsProperty ],
      xyComponents => toFixed( xyComponents.y, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES ) );

    let patternStringProperty: LocalizedStringProperty;
    let patternStringPropertyOptions;
    if ( vector instanceof BaseVector ) {

      // A base vector in the Equation screen.
      patternStringProperty = VectorAdditionStrings.a11y.vectorValuesAccordionBox.accessibleParagraphBaseVectorStringProperty;
      patternStringPropertyOptions = {
        symbol: vector.accessibleSymbolProperty,
        magnitude: magnitudeProperty,
        direction: directionProperty,
        xComponent: xComponentProperty,
        yComponent: yComponentProperty
      };
    }
    else if ( vector instanceof EquationsVector ) {

      // A vector that has a coefficient in the Equations screen.
      patternStringProperty = VectorAdditionStrings.a11y.vectorValuesAccordionBox.accessibleParagraphCoefficientVectorStringProperty;
      patternStringPropertyOptions = {
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
      patternStringProperty = VectorAdditionStrings.a11y.vectorValuesAccordionBox.accessibleParagraphStringProperty;
      patternStringPropertyOptions = {
        symbol: vector.accessibleSymbolProperty,
        magnitude: magnitudeProperty,
        direction: directionProperty,
        xComponent: xComponentProperty,
        yComponent: yComponentProperty
      };
    }

    super( patternStringProperty, patternStringPropertyOptions );

    this.disposeEmitter.addListener( () => {
      magnitudeProperty.dispose();
      directionProperty.dispose();
      xComponentProperty.dispose();
      yComponentProperty.dispose();
      patternStringProperty.dispose();
    } );
  }
}

vectorAddition.register( 'VectorValuesAccessibleParagraphProperty', VectorValuesAccessibleParagraphProperty );