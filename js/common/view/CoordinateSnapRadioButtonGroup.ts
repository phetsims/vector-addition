// Copyright 2019-2023, University of Colorado Boulder

/**
 * Radio button group for switching between polar and Cartesian snap modes.
 *
 * See https://github.com/phetsims/vector-addition/issues/21 for a visual.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import vectorAddition from '../../vectorAddition.js';
import CoordinateSnapModes from '../model/CoordinateSnapModes.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import { EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

type CoordinateSnapRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class CoordinateSnapRadioButtonGroup extends RectangularRadioButtonGroup<CoordinateSnapModes> {

  public constructor( coordinateSnapModeProperty: EnumerationProperty<CoordinateSnapModes>,
                      cartesianVectorColorPalette: VectorColorPalette,
                      polarVectorColorPalette: VectorColorPalette,
                      providedOptions?: CoordinateSnapRadioButtonGroupOptions ) {

    const options = optionize3<CoordinateSnapRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<CoordinateSnapModes>[] = [
      {
        value: CoordinateSnapModes.CARTESIAN,
        createNode: () => VectorAdditionIconFactory.createCartesianSnapModeIcon( cartesianVectorColorPalette )
      },
      {
        value: CoordinateSnapModes.POLAR,
        createNode: () => VectorAdditionIconFactory.createPolarSnapModeIcon( polarVectorColorPalette )
      }
    ];

    super( coordinateSnapModeProperty, items, options );
  }

  public override dispose(): void {
    assert && assert( false, 'CoordinateSnapRadioButtonGroup is not intended to be disposed' );
    super.dispose();
  }
}

vectorAddition.register( 'CoordinateSnapRadioButtonGroup', CoordinateSnapRadioButtonGroup );