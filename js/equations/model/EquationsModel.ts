// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsModel is the model for the 'Equations' screen.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CoordinateSnapMode from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsGraph from './EquationsGraph.js';

export default class EquationsModel extends VectorAdditionModel {

  public readonly sumVisibleProperty: Property<boolean>;

  public readonly cartesianVectorColorPalette: VectorColorPalette;
  public readonly polarVectorColorPalette: VectorColorPalette;

  // graph for Cartesian snap mode
  public readonly cartesianGraph: EquationsGraph;

  // graph for Polar snap mode
  public readonly polarGraph: EquationsGraph;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sumVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    this.cartesianVectorColorPalette = VectorAdditionColors.EQUATIONS_BLUE_COLOR_PALETTE;
    this.polarVectorColorPalette = VectorAdditionColors.EQUATIONS_PINK_COLOR_PALETTE;

    this.cartesianGraph = new EquationsGraph( CoordinateSnapMode.CARTESIAN,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.cartesianVectorColorPalette
    );

    this.polarGraph = new EquationsGraph( CoordinateSnapMode.POLAR,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.polarVectorColorPalette
    );
  }

  public override reset(): void {
    super.reset();
    this.sumVisibleProperty.reset();
    this.cartesianGraph.reset();
    this.polarGraph.reset();
  }
}

vectorAddition.register( 'EquationsModel', EquationsModel );