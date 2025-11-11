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

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import Graph from '../../common/model/Graph.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet, { EquationsVectorDescription } from './EquationsVectorSet.js';
import { EquationType, EquationTypeValues } from './EquationType.js';

export default class EquationsScene extends VectorAdditionScene {

  // Selected equation type determines how the resultant vector is derived.
  public readonly equationTypeProperty: StringUnionProperty<EquationType>;

  // This scene has one vector set.
  public readonly vectorSet: EquationsVectorSet;

  protected constructor( accessibleSceneNameStringProperty: TReadOnlyProperty<string>,
                         coordinateSnapMode: CoordinateSnapMode,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         vectorColorPalette: VectorColorPalette,
                         vectorDescriptions: EquationsVectorDescription[],
                         resultantSymbolProperty: TReadOnlyProperty<string>,
                         resultantTandemNameSymbol: string,
                         tandem: Tandem ) {

    super( accessibleSceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        bounds: VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS,

        // Bottom left corner of the graph is positioned a bit lower than other screens (in view coordinates).
        bottomLeft: new Vector2( Graph.DEFAULT_BOTTOM_LEFT.x, Graph.DEFAULT_BOTTOM_LEFT.y + 40 )
      },
      tandem: tandem
    } );

    this.equationTypeProperty = new StringUnionProperty( 'addition', {
      validValues: EquationTypeValues,
      tandem: tandem.createTandem( 'equationTypeProperty' ),
      phetioFeatured: true
    } );

    this.vectorSet = new EquationsVectorSet( this.graph, this.selectedVectorProperty, this.equationTypeProperty,
      componentVectorStyleProperty, vectorDescriptions, resultantSymbolProperty, resultantTandemNameSymbol, {
        coordinateSnapMode: coordinateSnapMode,
        vectorColorPalette: vectorColorPalette,
        tandem: tandem.createTandem( 'vectorSet' )
      } );

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