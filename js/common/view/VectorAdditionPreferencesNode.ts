// Copyright 2025, University of Colorado Boulder

/**
 * VectorAdditionPreferencesNode is the user interface for sim-specific preferences, accessed via the
 * Simulation tab of the Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionPreferences from '../model/VectorAdditionPreferences.js';
import AngleConventionControl from './AngleConventionControl.js';

export default class VectorAdditionPreferencesNode extends VBox {

  public constructor( preferences: VectorAdditionPreferences, tandem: Tandem ) {

    const angleConventionControl = new AngleConventionControl( preferences.angleConventionProperty,
      tandem.createTandem( 'initialCoefficientControl' ) );

    super( {
      isDisposable: false,
      children: [ angleConventionControl ],
      align: 'left',
      spacing: 30,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

vectorAddition.register( 'VectorAdditionPreferencesNode', VectorAdditionPreferencesNode );