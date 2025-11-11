// Copyright 2025, University of Colorado Boulder

/**
 * HorizontalVerticalSceneRadioButtonGroup is a radio button group for switching between horizontal and vertical 1D scenes.
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
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';

type SelfOptions = EmptySelfOptions;

type CartesianPolarRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class HorizontalVerticalSceneRadioButtonGroup<S extends VectorAdditionScene> extends RectangularRadioButtonGroup<S> {

  public constructor( sceneProperty: Property<S>,
                      horizontalScene: S,
                      verticalScene: S,
                      providedOptions: CartesianPolarRadioButtonGroupOptions ) {

    const options = optionize4<CartesianPolarRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {

        // RectangularRadioButtonGroupOptions
        isDisposable: false,
        phetioVisiblePropertyInstrumented: true,
        accessibleName: VectorAdditionStrings.a11y.horizontalVerticalSceneRadioButtonGroup.accessibleNameStringProperty,
        accessibleHelpText: VectorAdditionStrings.a11y.horizontalVerticalSceneRadioButtonGroup.accessibleHelpTextStringProperty
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<S>[] = [
      {
        value: horizontalScene,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( 'horizontal' ),
        tandemName: 'horizontalRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.horizontalRadioButton.accessibleNameStringProperty
        }
      },
      {
        value: verticalScene,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( 'vertical' ),
        tandemName: 'verticalRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.verticalRadioButton.accessibleNameStringProperty
        }
      }
    ];

    super( sceneProperty, items, options );
  }
}

vectorAddition.register( 'HorizontalVerticalSceneRadioButtonGroup', HorizontalVerticalSceneRadioButtonGroup );