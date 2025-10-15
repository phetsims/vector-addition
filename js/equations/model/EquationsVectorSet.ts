// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVectorSet is a specialization of VectorSet for the 'Equations' screen.  It adds:
 *
 *  - a set of vectors that are permanently on the graph and not disposable
 *  - an EquationsResultantVector
 *
 * @author Brandon Li
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet, { VectorSetOptions } from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsResultantVector from './EquationsResultantVector.js';
import EquationsVector from './EquationsVector.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Vector from '../../common/model/Vector.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import { EquationType } from './EquationType.js';
import Graph from '../../common/model/Graph.js';

// Describes a non-resultant vector for the Equations screen.
export type EquationsVectorDescription = {
  symbolProperty: TReadOnlyProperty<string>; // symbol for the vector used in the user interface
  tandemNameSymbol: string; // symbol for the vector used in tandem names
  xyComponents: Vector2;
  vectorTail: Vector2;
  baseVectorTail: Vector2;
};

export default class EquationsVectorSet extends VectorSet {

  // Symbols that appear in the equations on the radio buttons in EquationTypeRadioButtonGroup.
  public readonly equationSymbolProperties: TReadOnlyProperty<string>[];

  // We need to know about EquationsVector instances, a specialization of Vector.
  // We can use a regular array (instead of ObservableArray) because the set of vectors is static in this screen.
  public readonly allVectors: EquationsVector[];

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      coordinateSnapMode: CoordinateSnapMode,
                      equationTypeProperty: TReadOnlyProperty<EquationType>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      vectorDescriptions: EquationsVectorDescription[],
                      resultantSymbolProperty: TReadOnlyProperty<string>,
                      resultantTandemNameSymbol: string,
                      tandem: Tandem ) {

    const options: VectorSetOptions = {
      createResultantVector: ( tailPosition: Vector2,
                               vectorSet: VectorSet,
                               symbolProperty: TReadOnlyProperty<string>,
                               tandemNameSymbol: string,
                               tandem: Tandem ) =>
        new EquationsResultantVector( tailPosition, vectorSet, graph, selectedVectorProperty, coordinateSnapMode, equationTypeProperty, {
          symbolProperty: symbolProperty,
          tandemNameSymbol: tandemNameSymbol,
          tandem: tandem
        } ),
      resultantTailPosition: new Vector2( 25, 5 ),

      // offsets for resultant component vectors with ComponentVectorStyle 'projection'
      resultantProjectionXOffset: 0.5,
      resultantProjectionYOffset: 0.5,

      resultantSymbolProperty: resultantSymbolProperty,
      resultantTandemNameSymbol: resultantTandemNameSymbol,
      activeVectorsInstrumented: false,
      tandem: tandem
    };

    super( graph, selectedVectorProperty, coordinateSnapMode, componentVectorStyleProperty, vectorColorPalette, options );

    this.equationSymbolProperties = [];
    this.allVectors = [];

    // Create the individual vectors.
    for ( let i = 0; i < vectorDescriptions.length; i++ ) {

      const vectorDescription = vectorDescriptions[ i ];

      const vector = new EquationsVector(
        vectorDescription.vectorTail,
        vectorDescription.xyComponents,
        vectorDescription.baseVectorTail,
        this,
        graph,
        selectedVectorProperty,
        coordinateSnapMode, {
          symbolProperty: vectorDescription.symbolProperty,
          tandemNameSymbol: vectorDescription.tandemNameSymbol,
          tandem: options.tandem.createTandem( `${vectorDescription.tandemNameSymbol}Vector` )
        } );

      this.allVectors.push( vector );
      this.activeVectors.push( vector );
      this.equationSymbolProperties.push( vectorDescription.symbolProperty );
    }

    // The resultant vector symbol ('c' or 'f') appears in the equations, so add it.
    this.equationSymbolProperties.push( this.resultantVector.symbolProperty );

    this.activeVectors.lengthProperty.lazyLink( () => {
      throw new Error( 'Active vectors cannot be added or removed after startup in the Equations screen.' );
    } );
  }

  /**
   * We are not calling super.reset() because the default behavior is to erase all vectors - that is, remove
   * them from this.activeVectors, returning them to the toolbox. In the Equations screen, there is no toolbox,
   * and all vectors are always active.
   */
  public override reset(): void {
    this.allVectors.forEach( vector => vector.reset() );
    // Do not call super.reset -- see note above!
  }
}

vectorAddition.register( 'EquationsVectorSet', EquationsVectorSet );