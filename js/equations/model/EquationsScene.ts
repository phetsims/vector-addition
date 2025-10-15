// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsScene is the base class for scenes in the 'Equations' screen.
 *
 * Characteristics of an EquationsScene are:
 *  - it snaps to either Cartesian or polar coordinates
 *  - it has 1 VectorSet
 *  - it has a Property to select the equation type (addition/subtraction/negation) per scene
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet, { EquationsVectorDescription } from './EquationsVectorSet.js';
import { EquationType, EquationTypeValues } from './EquationType.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Graph from '../../common/model/Graph.js';

export default class EquationsScene extends VectorAdditionScene {

  // Which of the 3 equation types is currently selected.
  public readonly equationTypeProperty: StringUnionProperty<EquationType>;

  // This scene has one vector set.
  public readonly vectorSet: EquationsVectorSet;

  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         coordinateSnapMode: CoordinateSnapMode,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         vectorColorPalette: VectorColorPalette,
                         vectorDescriptions: EquationsVectorDescription[],
                         resultantSymbolProperty: TReadOnlyProperty<string>,
                         resultantTandemNameSymbol: string,
                         tandem: Tandem ) {

    super( sceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        bounds: VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,

        // Bottom left corner of the graph is positioned a bit lower than other screens (in view coordinates).
        bottomLeft: new Vector2( Graph.DEFAULT_BOTTOM_LEFT.x, Graph.DEFAULT_BOTTOM_LEFT.y + 40 )
      },
      tandem: tandem
    } );

    this.equationTypeProperty = new StringUnionProperty( 'addition', {
      validValues: EquationTypeValues,
      tandem: tandem.createTandem( 'equationTypeProperty' )
    } );

    this.vectorSet = new EquationsVectorSet( this.graph, this.selectedVectorProperty, this.coordinateSnapMode,
      this.equationTypeProperty, componentVectorStyleProperty, vectorColorPalette, vectorDescriptions,
      resultantSymbolProperty, resultantTandemNameSymbol, tandem.createTandem( 'vectorSet' ) );

    this.vectorSets.push( this.vectorSet );
  }

  public override reset(): void {
    super.reset();
    this.equationTypeProperty.reset();
    this.vectorSet.reset();
  }

  public override erase(): void {
    throw new Error( 'EquationsScene does not support erase.' );
  }
}

vectorAddition.register( 'EquationsScene', EquationsScene );