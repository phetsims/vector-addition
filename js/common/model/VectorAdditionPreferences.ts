// Copyright 2025, University of Colorado Boulder

/**
 * VectorAdditionPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * Preferences are implemented as a singleton. They are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { AngleConvention, AngleConventionValues } from './AngleConvention.js';

export default class VectorAdditionPreferences {

  // Convention used for displaying angles. See https://github.com/phetsims/vector-addition/issues/276
  public readonly angleConventionProperty: StringUnionProperty<AngleConvention>;

  // Singleton instance
  public static readonly instance = new VectorAdditionPreferences();

  // Private because this is a singleton, accessed via VectorAdditionPreferences.instance.
  private constructor() {

    this.angleConventionProperty = new StringUnionProperty( 'fullRotation', {
      validValues: AngleConventionValues,
      tandem: Tandem.PREFERENCES.createTandem( 'angleConventionProperty' ),
      phetioDocumentation: 'The convention used for displaying angles.',
      phetioFeatured: true
    } );
  }
}

vectorAddition.register( 'VectorAdditionPreferences', VectorAdditionPreferences );