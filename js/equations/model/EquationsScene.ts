// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsScene is a scene in the 'Equations' screen.
 *
 * Characteristics of an EquationsScene are:
 *  - it snaps to either Cartesian or polar coordinates
 *  - it has 1 VectorSet
 *  - it has a Property to select the equation type (addition/subtraction/negation) per scene
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import { EquationType, EquationTypeValues } from './EquationType.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants

// scene bounds for EquationsGraphs
const EQUATIONS_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

// Bottom left corner, in view coordinates.
const BOTTOM_LEFT = new Vector2( VectorAdditionScene.DEFAULT_BOTTOM_LEFT.x, VectorAdditionScene.DEFAULT_BOTTOM_LEFT.y + 40 );

// Starting equation type
const STARTING_EQUATION_TYPE: EquationType = 'addition';

export default class EquationsScene extends VectorAdditionScene {

  public readonly equationTypeProperty: StringUnionProperty<EquationType>;
  public readonly vectorSet: EquationsVectorSet;

  public constructor( coordinateSnapMode: CoordinateSnapMode,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    super( EQUATIONS_GRAPH_BOUNDS, coordinateSnapMode, {
      bottomLeft: BOTTOM_LEFT,
      tandem: tandem
    } );

    this.equationTypeProperty = new StringUnionProperty( STARTING_EQUATION_TYPE, {
      validValues: EquationTypeValues,
      tandem: tandem.createTandem( 'equationTypeProperty' )
    } );

    this.vectorSet = new EquationsVectorSet( this, componentVectorStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode );

    this.vectorSets.push( this.vectorSet );
  }

  public override reset(): void {
    super.reset();
    this.equationTypeProperty.reset();
  }
}

vectorAddition.register( 'EquationsScene', EquationsScene );