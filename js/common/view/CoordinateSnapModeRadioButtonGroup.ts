// Copyright 2019-2025, University of Colorado Boulder

/**
 * Radio button group for switching between polar and Cartesian snap modes.
 *
 * See https://github.com/phetsims/vector-addition/issues/21 for a visual.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import vectorAddition from '../../vectorAddition.js';
import CoordinateSnapMode from '../model/CoordinateSnapMode.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type CoordinateSnapModeRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions & PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class CoordinateSnapModeRadioButtonGroup extends RectangularRadioButtonGroup<CoordinateSnapMode> {

  public constructor( coordinateSnapModeProperty: EnumerationProperty<CoordinateSnapMode>,
                      cartesianVectorColorPalette: VectorColorPalette,
                      polarVectorColorPalette: VectorColorPalette,
                      providedOptions: CoordinateSnapModeRadioButtonGroupOptions ) {

    const options = optionize4<CoordinateSnapModeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        isDisposable: false
      }, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<CoordinateSnapMode>[] = [
      {
        value: CoordinateSnapMode.CARTESIAN,
        createNode: () => VectorAdditionIconFactory.createCartesianSnapModeIcon( cartesianVectorColorPalette ),
        tandemName: 'cartesianRadioButton'
      },
      {
        value: CoordinateSnapMode.POLAR,
        createNode: () => VectorAdditionIconFactory.createPolarSnapModeIcon( polarVectorColorPalette ),
        tandemName: 'polarRadioButton'
      }
    ];

    super( coordinateSnapModeProperty, items, options );
  }
}

vectorAddition.register( 'CoordinateSnapModeRadioButtonGroup', CoordinateSnapModeRadioButtonGroup );