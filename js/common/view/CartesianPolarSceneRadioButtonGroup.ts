// Copyright 2025, University of Colorado Boulder

/**
 * CartesianPolarSceneRadioButtonGroup is a radio button group for switching between Cartesian and polar scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

type SelfOptions = EmptySelfOptions;

type CartesianPolarRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class CartesianPolarSceneRadioButtonGroup<T extends VectorAdditionScene> extends RectangularRadioButtonGroup<T> {

  public constructor( sceneProperty: Property<T>,
                      cartesianScene: T,
                      cartesianColorPalette: VectorColorPalette,
                      polarScene: T,
                      polarColorPalette: VectorColorPalette,
                      providedOptions: CartesianPolarRadioButtonGroupOptions ) {

    const options = optionize4<CartesianPolarRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {

        // RectangularRadioButtonGroupOptions
        isDisposable: false,
        accessibleName: VectorAdditionStrings.a11y.cartesianPolarSceneRadioButtonGroup.accessibleNameStringProperty,
        accessibleHelpText: VectorAdditionStrings.a11y.cartesianPolarSceneRadioButtonGroup.accessibleHelpTextStringProperty
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<T>[] = [
      {
        value: cartesianScene,
        createNode: () => VectorAdditionIconFactory.createCartesianSceneIcon( cartesianColorPalette, 'triangle' ),
        tandemName: 'cartesianRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.cartesianRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.cartesianRadioButton.accessibleHelpTextStringProperty
        }
      },
      {
        value: polarScene,
        createNode: () => VectorAdditionIconFactory.createPolarSceneIcon( polarColorPalette ),
        tandemName: 'polarRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.polarRadioButton.accessibleNameStringProperty,
          accessibleHelpText: new PatternStringProperty( VectorAdditionStrings.a11y.polarRadioButton.accessibleHelpTextStringProperty, {
            polarAngleInterval: VectorAdditionConstants.POLAR_ANGLE_INTERVAL
          } )
        }
      }
    ];

    super( sceneProperty, items, options );
  }
}

vectorAddition.register( 'CartesianPolarSceneRadioButtonGroup', CartesianPolarSceneRadioButtonGroup );